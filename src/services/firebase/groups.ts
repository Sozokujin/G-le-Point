import { db } from "@/services/firebase/config";
import useUserStore from "@/stores/userStore";

import {  collection, getDocs, query, where, addDoc } from "firebase/firestore";

export const getAllGroups = async () => {
    const currentUser = useUserStore.getState().currentUser;

    if (!currentUser?.uid) return [];

    const groupsCollectionRef = collection(db, "groups");

    const q = query(groupsCollectionRef, where("members", "array-contains", currentUser.uid));

    const q2 = query(groupsCollectionRef, where("groupOwner", "==", currentUser.uid));

    const [querySnapshot, querySnapshot2] = await Promise.all([getDocs(q), getDocs(q2)]);
    const memberGroups = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const ownerGroups = querySnapshot2.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const allGroups: { id: string }[] = [...memberGroups, ...ownerGroups];

    const uniqueGroups = allGroups.reduce((acc: { id: string }[], group) => {
        if (!acc.some(g => g.id === group.id)) {
            acc.push(group);
        }
        return acc;
    }, []);

    return uniqueGroups;
};

export const createGroup = async (name: string, members: string[]) => {
    const currentUser = useUserStore.getState().currentUser;

    if (!currentUser?.uid) {
        return;
    }

    const groupsCollectionRef = collection(db, "groups");

    const docRef = await addDoc(groupsCollectionRef, {
        name,
        groupOwner: currentUser.uid,
        members: members.concat(currentUser.uid),
    });

    return docRef.id;
}
