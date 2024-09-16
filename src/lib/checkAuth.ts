"use client";

import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getBio, getScore, getSuperMarkers, getUsername } from '@/services/firebase/profil';
import useUserStore from '@/stores/userStore';

export default function CheckAuth() {
    const auth = getAuth();
    const {
        currentUser,
        setCurrentUser,
        clearCurrentUser
    } = useUserStore();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                if (firebaseUser.uid === currentUser?.uid) return;

                setCurrentUser({
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    username: await getUsername(firebaseUser.uid),
                    bio: await getBio(firebaseUser.uid),
                    superMarkers: await getSuperMarkers(firebaseUser.uid),
                    score: await getScore(firebaseUser.uid)
                });
            } else {
                clearCurrentUser();
                window.location.href = '/';
            }
        });

        return () => unsubscribe();
    }, [auth, currentUser, setCurrentUser, clearCurrentUser]);

    return null;
}