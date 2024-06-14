"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, db } from "@/db/firebase";
import { redirectTo } from "@/lib/actions";
import { FirebaseUser, googleSignIn, useAuthStore } from "@/stores/authStore";
import { browserLocalPersistence, setPersistence } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { useEffect } from "react";

const Login = () => {
  const { isAuthenticated, login } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      redirectTo("/map");
    }
  }, [isAuthenticated]);

  const addToDbIfNewUser = async (user: any) => {
    const usersCollectionRef = collection(db, "users");
    const querry = query(usersCollectionRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(querry);
    if (querySnapshot.empty) {
      addDoc(usersCollectionRef, {
        ...user,
        friends: [],
        invitationCode: Math.random().toString(36).substr(2, 9),
      });
    }
  };

  const handleSignInFacebook = async () => {};

  const handleSignInGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const authUser = await googleSignIn();
      if (authUser && authUser.user) {
        const firebaseUser: FirebaseUser = {
          uid: authUser.user.uid,
          displayName: authUser.user.displayName,
          email: authUser.user.email,
          photoURL: authUser.user.photoURL,
        };
        login(firebaseUser);
        addToDbIfNewUser(firebaseUser);
        redirectTo("/map");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="h-[90vh] flex justify-center items-center flex-col gap-24">
      <div>
        <h1 className="text-3xl font-semibold leading-none tracking-tight text-center">
          G&apos;Le point
        </h1>
        <h2 className="text-xl font-semibold leading-none tracking-tight text-center mt-4">
          Votre carte collaborative
        </h2>
      </div>

      <Card className="w-3/4 flex items-center flex-col md:w-auto md:px-24">
        <CardHeader>
          <CardTitle>Connectez vous</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button variant="outline" size="sm" onClick={handleSignInGoogle}>
            Se connecter avec
            <Image
              src="google-icon.svg"
              height={18}
              width={18}
              alt="Google Icon"
              className="ml-2"
            />
          </Button>
          <Button variant="outline" size="sm" onClick={handleSignInFacebook}>
            Se connecter avec
            <Image
              src="facebook-icon.svg"
              height={18}
              width={18}
              alt="Facebook Icon"
              className="ml-2"
            />
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;
