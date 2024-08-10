/* eslint-disable react/no-unescaped-entities */
"use client";
import { Button } from "@/components/ui/button";
import { redirectTo } from "@/lib/actions";
import { auth, db } from "@/services/firebase/config";
import {
  faceBookSignIn,
  googleSignIn,
  microsoftSignIn,
  useAuthStore,
  xSignIn,
} from "@/stores/authStore";
import { FirebaseUser } from "@/types/index";
import { browserLocalPersistence, setPersistence } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Login = () => {
  const { isAuthenticated, login } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      redirectTo("/map");
    }
  }, [isAuthenticated]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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

  const handleSignInFacebook = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const authUser = await faceBookSignIn();
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
    } catch (error: Error | any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        setErrorMessage(
          "Un compte avec cette adresse email existe déjà, veuillez vous connecter avec un autre fournisseur de connexion"
        );
      }
    }
  };

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
    } catch (error: Error | any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        setErrorMessage(
          "Un compte avec cette adresse email existe déjà, veuillez vous connecter avec un autre fournisseur de connexion"
        );
      }
    }
  };

  const handleSignInMicrosoft = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const authUser = await microsoftSignIn();
      console.log(authUser);
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
    } catch (error: Error | any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        setErrorMessage(
          "Un compte avec cette adresse email existe déjà, veuillez vous connecter avec un autre fournisseur de connexion"
        );
      }
    }
  };

  const handleSignInX = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const authUser = await xSignIn();
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
    } catch (error: Error | any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        setErrorMessage(
          "Un compte avec cette adresse email existe déjà, veuillez vous connecter avec un autre fournisseur de connexion"
        );
      }
    }
  };

  const handleSignInApple = async () => {};

  const tierceApps = [
    {
      name: "Google",
      icon: "/images/google-icon.svg",
      action: handleSignInGoogle,
      active: true,
    },
    {
      name: "Facebook",
      icon: "/images/facebook-icon.svg",
      action: handleSignInFacebook,
      active: true,
    },
    {
      name: "Microsoft",
      icon: "/images/microsoft-icon.svg",
      action: handleSignInMicrosoft,
      active: true,
    },
    {
      name: "X",
      icon: "/images/x-icon.svg",
      action: handleSignInX,
      active: true,
    },
    {
      name: "Apple",
      icon: "/images/apple-icon.svg",
      action: handleSignInApple,
      active: false,
    },
  ];

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              Commencez à explorer de nouveaux horizons
            </h1>
            <p className="text-balance text-muted-foreground">
              Veuillez choisir votre méthode de connexion :
            </p>
          </div>
          <div className="grid gap-4">
            {tierceApps.map((app) => (
              <Button
                key={app.name}
                variant="outline"
                className={`w-full flex justify-center items-center gap-4 ${
                  app.active ? "" : "opacity-50 cursor-not-allowed"
                }`}
                onClick={app.action}
              >
                <Image src={app.icon} alt="" width={16} height={16} />
                Se connecter avec {app.name}
              </Button>
            ))}

            <Link href="/" className="text-center text-xs underline">
              Retourner sur la page d'accueil
            </Link>
            {errorMessage && (
              <div className="absolute top-4 right-4 h-auto w-48 bg-glp-green-600 p-5 rounded-sm flex justify-center items-center text-white">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/images/wallpaper.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Login;
