import { FirebaseUser } from '@/types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

export const getUserById = async (uid: string): Promise<FirebaseUser | null> => {
    try {
        const userCollectionRef = collection(db, 'users');
        const userQuery = query(userCollectionRef, where('uid', '==', uid));

        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            console.error('Aucun utilisateur trouvé pour cet ID.');
            return null;
        } else {
            let user: FirebaseUser | null = null;
            userSnapshot.forEach((doc) => {
                user = doc.data() as FirebaseUser;
            });

            return user;
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return null;
    }
};

export const getUsersByIds = async (uids: string[]): Promise<FirebaseUser[]> => {
    try {
        if (uids.length === 0) {
            console.error("Aucun ID d'utilisateur fourni.");
            return [];
        }
        const userCollectionRef = collection(db, 'users');
        const userQuery = query(userCollectionRef, where('uid', 'in', uids));

        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            console.error('Aucun utilisateur trouvé pour ces ID.');
            return [];
        } else {
            const users: FirebaseUser[] = [];
            userSnapshot.forEach((doc) => {
                users.push(doc.data() as FirebaseUser);
            });

            return users;
        }
    } catch (error) {
        console.error('Error fetching users by IDs:', error);
        return [];
    }
};

export const getUserLikeCount = async (uid: string): Promise<number> => {
    if (!uid) {
        console.error("Aucun ID d'utilisateur fourni.");
        return 0;
    }
    try {
        const markersRef = collection(db, 'markers');
        const userMarkersQuery = query(markersRef, where('user.uid', '==', uid));
        const querySnapshot = await getDocs(userMarkersQuery);

        let totalLikes = 0;
        querySnapshot.forEach((doc) => {
            const markerData = doc.data();
            totalLikes += markerData.likeCount || 0;
        });

        return totalLikes;
    } catch (error) {
        console.error('Error fetching user like count:', error);
        return 0;
    }
};
