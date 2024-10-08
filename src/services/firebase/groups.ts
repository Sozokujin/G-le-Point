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
import { db } from '@/services/firebase/config';
import useUserStore from '@/stores/userStore';
import { useGroupStore } from '@/stores/groupStore';
import { Group } from '@/types';

export const getAllGroups = async (): Promise<Group[]> => {
    try {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser) {
            return [];
        }

        const groupsCollectionRef = collection(db, 'groups');
        const memberQuery = query(groupsCollectionRef, where('members', 'array-contains', currentUser.uid));
        const ownerQuery = query(groupsCollectionRef, where('groupOwner', '==', currentUser.uid));

        const [memberSnapshot, ownerSnapshot] = await Promise.all([getDocs(memberQuery), getDocs(ownerQuery)]);

        const groups = [...memberSnapshot.docs, ...ownerSnapshot.docs].map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data()
                }) as Group
        );
        return Array.from(new Set(groups.filter((group, index, self) => index === self.findIndex((t) => t.id === group.id))));
    } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
    }
};

export const createGroup = async (name: string, members: string[]): Promise<string | null> => {
    try {
        if (members.length === 0) {
            throw new Error('Group must have at least one member');
        }
        if (name.trim() === '') {
            throw new Error('Group name cannot be empty');
        }
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser?.uid) {
            return null;
        }

        const groupsCollectionRef = collection(db, 'groups');
        const newGroup: Omit<Group, 'id'> = {
            name,
            groupOwner: currentUser.uid,
            members: [...members, currentUser.uid],
            markers: []
        };

        const docRef = await addDoc(groupsCollectionRef, newGroup);

        const createdGroup: Group = { id: docRef.id, ...newGroup };
        useGroupStore.getState().addGroup(createdGroup);

        return docRef.id;
    } catch (error) {
        console.error('Error creating group:', error);
        return null;
    }
};

export const leaveGroup = async (groupId: string): Promise<void> => {
    try {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser?.uid) {
            throw new Error('User not authenticated');
        }

        const groupRef = doc(db, 'groups', groupId);
        const groupSnapshot = await getDoc(groupRef);

        if (!groupSnapshot.exists()) {
            throw new Error('Group not found');
        }

        const groupData = groupSnapshot.data() as Group;
        const isOwner = groupData.groupOwner === currentUser.uid;
        const updatedMembers = groupData.members.filter((memberId) => memberId !== currentUser.uid);

        if (isOwner) {
            if (updatedMembers.length === 0) {
                await deleteDoc(groupRef);
                console.warn('Group deleted, owner was the last member');
            } else {
                const newOwner = updatedMembers[0];
                await updateDoc(groupRef, {
                    groupOwner: newOwner,
                    members: updatedMembers
                });
                console.warn('Ownership transferred and left the group');
            }
        } else {
            await updateDoc(groupRef, {
                members: arrayRemove(currentUser.uid)
            });
        }

        useGroupStore.getState().removeGroup(groupId);
    } catch (error) {
        console.error('Error leaving group:', error);
        throw error;
    }
};

export const kickUserFromGroup = async (groupId: string, userId: string): Promise<void> => {
    try {
        const currentUser = useUserStore.getState().currentUser;
        if (!currentUser?.uid) {
            throw new Error('User not authenticated');
        }

        const groupRef = doc(db, 'groups', groupId);
        const groupSnapshot = await getDoc(groupRef);

        if (!groupSnapshot.exists()) {
            throw new Error('Group not found');
        }

        const groupData = groupSnapshot.data() as Group;
        if (groupData.groupOwner !== currentUser.uid) {
            throw new Error('Only the group owner can kick members');
        }

        if (userId === groupData.groupOwner) {
            throw new Error('Cannot kick the group owner');
        }

        await updateDoc(groupRef, {
            members: arrayRemove(userId)
        });

        // Update the local store
        useGroupStore.getState().updateGroupMembers(groupId, userId);
    } catch (error) {
        console.error('Error kicking user from group:', error);
        throw error;
    }
};

export const updateGroupName = async (groupId: string, newName: string): Promise<void> => {
    try {
        if (newName.trim() === '') {
            throw new Error('Group name cannot be empty');
        }
        const groupRef = doc(db, 'groups', groupId);
        await updateDoc(groupRef, { name: newName });
    } catch (error) {
        console.error('Error updating group name:', error);
        throw error;
    }
};

export const addUserToGroup = async (groupId: string, userId: string): Promise<void> => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('User not found');
        }

        const groupRef = doc(db, 'groups', groupId);
        await updateDoc(groupRef, {
            members: arrayUnion(userId)
        });
    } catch (error) {
        console.error('Error adding user to group:', error);
        throw error;
    }
};
