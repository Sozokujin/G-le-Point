import { db } from '@/services/firebase/config';
import { Group, Marker } from '@/types/index';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    documentId,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { manageScore } from '@/services/firebase/leaderboard';
import useUserStore from '@/stores/userStore';

export const createMarker = async (marker: Omit<Marker, 'id'>): Promise<string> => {
    const markersCollectionRef = collection(db, 'markers');
    const docRef = await addDoc(markersCollectionRef, marker);
    return docRef.id;
};

export const deleteMarker = async (markerId: string) => {
    const markerDocRef = doc(db, 'markers', markerId);

    await deleteDoc(markerDocRef).catch((error) => {
        console.error('Error deleting marker:', error);
    });

    const groupsCollectionRef = collection(db, 'groups');
    const q = query(groupsCollectionRef, where('markers', 'array-contains', markerId));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (groupDoc) => {
        const groupDocRef = doc(db, 'groups', groupDoc.id);
        await updateDoc(groupDocRef, {
            markers: arrayRemove(markerId)
        }).catch((error) => {
            console.error('Error removing marker from group:', error);
        });
    });

    const user = useUserStore.getState().currentUser;
    if (user) {
        manageScore(user.uid, 'marker_created', false);
    }
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

export const getGroupMarkers = async (groupId: string): Promise<Marker[]> => {
    const groupDocRef = doc(db, 'groups', groupId);
    const groupDocSnapshot = await getDoc(groupDocRef);

    if (!groupDocSnapshot.exists()) {
        console.warn('Group not found');
        return [];
    }

    const group = groupDocSnapshot.data() as Group;
    const markers = group.markers || [];

    if (markers.length === 0) {
        console.warn('No markers found in group');
        return [];
    }

    const markerIds = markers.map((marker) => marker.idMarker);

    const markerCollectionRef = collection(db, 'markers');
    const markerQuery = query(markerCollectionRef, where(documentId(), 'in', markerIds));
    const markerQuerySnapshot = await getDocs(markerQuery);

    return markerQuerySnapshot.docs.map(
        (doc) =>
            ({
                id: doc.id,
                ...doc.data()
            }) as Marker
    );
};

export const getGroupsMarkers = async (userUid: string): Promise<Marker[]> => {
    const groupCollectionRef = collection(db, 'groups');
    const groupQuery = query(groupCollectionRef, where('members', 'array-contains', userUid));
    const groupQuerySnapshot = await getDocs(groupQuery);

    const allMarkerIds: string[] = [];
    groupQuerySnapshot.forEach((groupDoc) => {
        const group = groupDoc.data() as Group;
        const groupMarkerIds = (group.markers || [])
            .filter((marker) => marker.idUser !== userUid)
            .map((marker) => marker.idMarker);
        allMarkerIds.push(...groupMarkerIds);
    });

    if (allMarkerIds.length === 0) {
        return [];
    }

    const markersCollectionRef = collection(db, 'markers');
    const markerQuery = query(
        markersCollectionRef,
        where(documentId(), 'in', allMarkerIds),
        where('visibiltyStatus', '==', 'groups')
    );
    const markerQuerySnapshot = await getDocs(markerQuery);

    return markerQuerySnapshot.docs.map(
        (doc) =>
            ({
                id: doc.id,
                ...doc.data()
            }) as Marker
    );
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
        await manageScore(markerData.user.uid, 'marker_liked', true);
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
        await manageScore(markerData.user.uid, 'marker_liked', false);
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
