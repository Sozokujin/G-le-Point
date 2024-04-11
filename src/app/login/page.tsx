"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, db } from "@/db/firebase";
import { googleSignIn, useAuthStore } from "@/stores/authStore";
import { browserLocalPersistence, setPersistence } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Login = () => {
  const { isAuthenticated, login, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      redirect("/map");
    }
  }, [isAuthenticated]);

  const addToDbIfNewUser = async (user: any) => {
    const usersCollectionRef = collection(db, "users");
    const querry = query(usersCollectionRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(querry);
    if (querySnapshot.empty) {
      addDoc(usersCollectionRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        invitationCode: Math.random().toString(36).substring(7),
        friends: [],
      });
    }
  };

  const handleSignIn = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const authUser = await googleSignIn();
      if (authUser && authUser.user) {
        login(authUser.user);
        addToDbIfNewUser(authUser.user);
        redirect("/map");
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

      <Card className="w-3/4 flex items-center flex-col">
        <CardHeader>
          <CardTitle>Connectez vous</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="default" size="sm" onClick={handleSignIn}>
            Se connecter avec
            <Image
              src="google-icon.svg"
              height={18}
              width={18}
              alt="Google Icon"
              className="ml-2"
            />
          </Button>
        </CardContent>
      </Card>

      {isAuthenticated && (
        <div>
          <h1>Welcome {user.displayName}</h1>
        </div>
      )}
    </main>
  );
};

export default Login;
