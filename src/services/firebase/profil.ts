import { auth, db } from '@/services/firebase/config';
import { clearAllStores } from '@/stores/clearStores';
import { FirebaseUser } from '@/types';
import {
    deleteUser,
    FacebookAuthProvider,
    GoogleAuthProvider,
    OAuthProvider,
    reauthenticateWithPopup,
    signOut
} from 'firebase/auth';
import { arrayRemove, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'sonner';

export const updateUser = async (user: FirebaseUser) => {
    try {
        const userCollectionRef = collection(db, 'users');
        const currentUserQuery = query(userCollectionRef, where('uid', '==', user.uid));

        const currentUserSnapshot = await getDocs(currentUserQuery);

        let currentUserDocRef;
        if (!currentUserSnapshot.empty) {
            currentUserDocRef = doc(userCollectionRef, currentUserSnapshot.docs[0].id);
        } else {
            console.error("Aucun document trouvé pour l'utilisateur actuel.");
            throw new Error("Échec de la mise à jour de l'utilisateur.");
        }

        updateDoc(currentUserDocRef, {
            username: user.username,
            bio: user.bio
        });
    } catch (error) {
        console.error("Une erreur s'est produite lors de la mise à jour :", error);
        throw new Error("Échec de la mise à jour de l'utilisateur.");
    }
};

export const getBio = async (user: string): Promise<string> => {
    const currentUser = collection(db, 'users');
    const currentUserQuery = query(currentUser, where('uid', '==', user));
    const querySnapshot = await getDocs(currentUserQuery);
    if (!querySnapshot.empty) {
        let bio = '';
        querySnapshot.forEach((doc) => {
            bio = doc.data().bio;
        });
        return bio;
    }
    return '';
};

export const getUsername = async (user: string): Promise<string> => {
    const currentUser = collection(db, 'users');
    const currentUserQuery = query(currentUser, where('uid', '==', user));
    const querySnapshot = await getDocs(currentUserQuery);
    if (!querySnapshot.empty) {
        let username = '';
        querySnapshot.forEach((doc) => {
            username = doc.data().username;
        });
        return username;
    }
    return '';
};

export const getFriends = async (user: string): Promise<string[]> => {
    const currentUser = collection(db, 'users');
    const currentUserQuery = query(currentUser, where('uid', '==', user));
    const querySnapshot = await getDocs(currentUserQuery);
    if (!querySnapshot.empty) {
        let friends: string[] = [];
        querySnapshot.forEach((doc) => {
            friends = doc.data().friends;
        });
        return friends;
    }
    return [];
}

export const getSuperMarkers = async (user: string): Promise<number> => {
    const currentUser = collection(db, 'users');
    const currentUserQuery = query(currentUser, where('uid', '==', user));
    const querySnapshot = await getDocs(currentUserQuery);
    if (!querySnapshot.empty) {
        let superMarkers = 0;
        querySnapshot.forEach((doc) => {
            superMarkers = doc.data().superMarkers;
        });
        return superMarkers;
    }
    return 0;
};

export const getScore = async (user: string): Promise<number> => {
    const currentUser = collection(db, 'users');
    const currentUserQuery = query(currentUser, where('uid', '==', user));
    const querySnapshot = await getDocs(currentUserQuery);
    if (!querySnapshot.empty) {
        let score = 0;
        querySnapshot.forEach((doc) => {
            score = doc.data().score;
        });
        return score;
    }
    return 0;
};

export const deleteAccount = async () => {
    const user = auth.currentUser;

    if (!user) {
        toast.info('Vous devez être connecté pour supprimer votre compte.');
        return;
    }

    const uid = user.uid;

    let provider;
    const currentProviderId = user.providerData[0]?.providerId;

    switch (currentProviderId) {
        case 'google.com':
            provider = new GoogleAuthProvider();
            break;
        case 'facebook.com':
            provider = new FacebookAuthProvider();
            break;
        case 'microsoft.com':
            provider = new OAuthProvider('microsoft.com');
            break;
        case 'twitter.com':
            provider = new OAuthProvider('twitter.com');
            break;
        default:
            console.error('Fournisseur non supporté ou utilisateur non authentifié via un fournisseur SSO reconnu.');
            return;
    }

    await reauthenticateWithPopup(user, provider).catch((error) => {
        console.error('Erreur lors de la réauthentification:', error);
        throw new Error('Échec de la réauthentification.');
    });

    const friendRequestsRef = collection(db, 'friendRequests');
    const sentRequestsQuery = query(friendRequestsRef, where('from', '==', uid));
    const receivedRequestsQuery = query(friendRequestsRef, where('to', '==', uid));

    const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
    const receivedRequestsSnapshot = await getDocs(receivedRequestsQuery);

    sentRequestsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref).catch((error) => {
            console.error('Erreur lors de la suppression de la demande d\'ami envoyée:', error);
            throw new Error('Échec de la suppression de la demande d\'ami envoyée.');
        });
    });

    receivedRequestsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref).catch((error) => {
            console.error('Erreur lors de la suppression de la demande d\'ami reçue:', error);
            throw new Error('Échec de la suppression de la demande d\'ami reçue.');
        });
    });

    const groupsRef = collection(db, 'groups');
    const groupsQuery = query(groupsRef, where('groupOwner', '==', uid));

    const groupsSnapshot = await getDocs(groupsQuery);

    groupsSnapshot.forEach(async (groupDoc) => {
        const groupData = groupDoc.data();

        if (groupData.groupOwner === uid) {
            await deleteDoc(groupDoc.ref).catch((error) => {
                console.error('Erreur lors de la suppression du groupe:', error);
                throw new Error('Échec de la suppression du groupe.');
            });
        } else {
            const markersSubcollectionRef = collection(groupDoc.ref, 'markers');
            const markersQuery = query(markersSubcollectionRef, where('idUser', '==', uid));
            const markersSnapshot = await getDocs(markersQuery);

            markersSnapshot.forEach(async (markerDoc) => {
                await deleteDoc(markerDoc.ref).catch((error) => {
                    console.error('Erreur lors de la suppression du marqueur:', error);
                    throw new Error('Échec de la suppression du marqueur.');
                });
            });

            await updateDoc(groupDoc.ref, {
                markers: arrayRemove(uid)
            }).catch((error) => {
                console.error('Erreur lors de la suppression du marqueur de la liste des marqueurs du groupe:', error);
                throw new Error('Échec de la suppression du marqueur de la liste des marqueurs du groupe.');
            });
        }
    });

    const markersRef = collection(db, 'markers');
    const markersQuery = query(markersRef, where('user.uid', '==', uid));

    const markersSnapshot = await getDocs(markersQuery);

    markersSnapshot.forEach(async (markerDoc) => {
        await deleteDoc(markerDoc.ref).catch((error) => {
            console.error('Erreur lors de la suppression du marqueur:', error);
            throw new Error('Échec de la suppression du marqueur.');
        });
    });

    const userCollectionRef = collection(db, 'users');
    const currentUserQuery = query(userCollectionRef, where('uid', '==', uid));

    const currentUserSnapshot = await getDocs(currentUserQuery);

    if (currentUserSnapshot.empty) {
        throw new Error("Aucun document trouvé pour l'utilisateur actuel.");
    }

    const currentUserDocRef = doc(userCollectionRef, currentUserSnapshot.docs[0].id);
    await deleteDoc(currentUserDocRef).catch((error) => {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        throw new Error('Échec de la suppression de l\'utilisateur.');
    });

    await deleteUser(user).catch((error) => {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        throw new Error('Échec de la suppression de l\'utilisateur.');
    });

    await signOut(auth).catch((error) => {
        console.error('Erreur lors de la déconnexion:', error);
        throw new Error('Échec de la déconnexion.');
    });
    clearAllStores();
    fetch('/api/logout');
    window.location.href = '/?account=deleted';

};
