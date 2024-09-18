import { db } from '@/services/firebase/config';
import { Group, Marker } from '@/types/index';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { manageScore } from '@/services/firebase/leaderboard';
import useUserStore from '@/stores/userStore';

export const addMarker = async (marker: Marker) => {
    const markersCollectionRef = collection(db, 'markers');
    await addDoc(markersCollectionRef, marker);
};

export const deleteMarker = async (markerId: string) => {
    const markerDocRef = doc(db, 'markers', markerId);

    await deleteDoc(markerDocRef);

    const user = useUserStore.getState().currentUser;
    if (user) {
        manageScore(user.uid, 'markers', false);
    }

    const groupsCollectionRef = collection(db, 'groups');
    const q = query(groupsCollectionRef, where('markers', 'array-contains', markerId));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (groupDoc) => {
        const groupDocRef = doc(db, 'groups', groupDoc.id);
        await updateDoc(groupDocRef, {
            markers: arrayRemove(markerId)
        });
    });
};

export const getUserMarkers = async (userUid: any) => {
    const markersCollectionRef = collection(db, 'markers');
    const querry = query(markersCollectionRef, where('user.uid', '==', userUid));
    const querySnapshot = await getDocs(querry);
    return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
    })) as Marker[];
};

export const getFriendsMarkers = async (userUid: any) => {
    const markersCollectionRef = collection(db, 'markers');
    const userCollectionRef = collection(db, 'users');

    const userDocSnapshot = await getDocs(userCollectionRef);

    const friends: [] = userDocSnapshot.docs.map((doc) => doc.data()).find((user) => user.uid === userUid)?.friends;

    if (!friends || friends.length == 0) return [];

    const querry = query(markersCollectionRef, where('user.uid', 'in', friends), where('visibiltyStatus', '==', 'friends'));
    const querySnapshot = await getDocs(querry);
    return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
    })) as Marker[];
};

export const getGroupMarkers = async (groupId: string) => {
    const groupDocRef = doc(db, 'groups', groupId);
    const groupDocSnapshot = await getDoc(groupDocRef);

    const group = groupDocSnapshot.data() as Group;

    if (!group) {
        return [];
    }

    const markers = group.markers;

    if (!markers || markers.length === 0) {
        console.warn('No markers found in group');
        return [];
    }

    const markersData: Marker[] = [];
    const markerIds = markers.map((marker) => marker.idMarker);

    const markerCollectionRef = collection(db, 'markers');
    const markerQuery = query(markerCollectionRef, where('id', 'in', markerIds));
    const markerQuerySnapshot = await getDocs(markerQuery);

    markerQuerySnapshot.docs.forEach((doc) => {
        markersData.push({
            ...doc.data(),
            id: doc.id
        } as Marker);
    });

    return markersData as Marker[];
};

export const getGroupsMarkers = async (userUid: string) => {
    const markersCollectionRef = collection(db, 'markers');
    const groupCollectionRef = collection(db, 'groups');

    const groupDocSnapshot = await getDocs(groupCollectionRef);

    const userGroups = groupDocSnapshot.docs
        .map((doc) => doc.data())
        .filter((group) => group.members.includes(userUid))
        .flatMap((group) => group.markers)
        .filter((marker) => marker !== undefined && marker.idUser !== userUid);

    if (!userGroups || userGroups.length === 0) return [];

    const chunkSize = 10;
    const markers = [];

    for (let i = 0; i < userGroups.length; i += chunkSize) {
        const chunk = userGroups.slice(i, i + chunkSize).map((marker) => marker.idMarker);
        if (chunk.length > 0) {
            const markersQuery = query(markersCollectionRef, where('id', 'in', chunk), where('visibiltyStatus', '==', 'groups')); //FIXME Function where() called with invalid data. Unsupported field value: undefined
            const querySnapshot = await getDocs(markersQuery);
            markers.push(
                ...querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }))
            );
        }
    }

    return markers as Marker[];
};

export const getPublicMarkers = async (userUid: string) => {
    const markersCollectionRef = collection(db, 'markers');
    const querry = query(markersCollectionRef, where('visibiltyStatus', '==', 'public'));
    const querySnapshot = await getDocs(querry);

    // Filter out markers from the current user in the code
    return querySnapshot.docs
        .map((doc) => ({ ...(doc.data() as Marker), id: doc.id }))
        .filter((marker) => marker.user.uid !== userUid);
};

export const addMarkerGroup = async (markerId: string, groups: Group[], userId: string) => {
    for (const group of groups) {
        const groupDocRef = doc(db, 'groups', group.id);

        await updateDoc(groupDocRef, {
            markers: arrayUnion({
                idMarker: markerId,
                idUser: userId
            })
        });
    }
};

export const addLike = async (markerId: string, userId: string) => {
    const markerDocRef = doc(db, 'markers', markerId);

    const markerDoc = await getDoc(markerDocRef);

    if (markerDoc.exists()) {
        const markerData = markerDoc.data();
        const currentLikeCount = markerData.likeCount;

        await updateDoc(markerDocRef, {
            likedBy: arrayUnion(userId),
            likeCount: currentLikeCount + 1
        });
        await manageScore(markerData.user.uid, 'markers_liked', true);
    }
};

export const removeLike = async (markerId: string, userId: string) => {
    const markerDocRef = doc(db, 'markers', markerId);

    const markerDoc = await getDoc(markerDocRef);

    if (markerDoc.exists()) {
        const markerData = markerDoc.data();
        const currentLikeCount = markerData.likeCount;

        await updateDoc(markerDocRef, {
            likedBy: arrayRemove(userId),
            likeCount: currentLikeCount - 1
        });
        await manageScore(markerData.user.uid, 'markers_liked', false);
    }
};

export const addReport = async (markerId: string, userId: string) => {
    const markerDocRef = doc(db, 'markers', markerId);
    const markerDoc = await getDoc(markerDocRef);

    if (markerDoc.exists()) {
        const markerData = markerDoc.data();
        const currentReportCount = markerData.reportCount;

        await updateDoc(markerDocRef, {
            reportedBy: arrayUnion(userId),
            reportCount: currentReportCount + 1
        });
    }
};

export const removeReport = async (markerId: string, userId: string) => {
    const markerDocRef = doc(db, 'markers', markerId);
    const markerDoc = await getDoc(markerDocRef);

    if (markerDoc.exists()) {
        const markerData = markerDoc.data();
        const currentReportCount = markerData.reportCount;

        await updateDoc(markerDocRef, {
            reportedBy: arrayRemove(userId),
            reportCount: currentReportCount - 1
        });
    }
};
