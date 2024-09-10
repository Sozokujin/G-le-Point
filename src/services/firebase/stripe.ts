import { collection, getDocs, increment, query, updateDoc, where } from 'firebase/firestore';
import { db } from './config';

export const incrementSuperMarkersByUid = async (userUid: string, numberPoints: number) => {
    try {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('uid', '==', userUid));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return new Response('User not found', { status: 404 });
        }

        const userDoc = querySnapshot.docs[0];
        const userRef = userDoc.ref;

        await updateDoc(userRef, {
            superMarkers: increment(numberPoints)
        });

        return new Response('SuperMarkers incremented', {
            status: 200
        });
    } catch (error) {
        console.error('Error updating superMarkers:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};
