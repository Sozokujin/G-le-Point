/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/services/firebase/config";
import { Button } from "@/components/ui/button";
import { FirebaseUser } from "@/types/index";
import useUserStore from "@/stores/userStore";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
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
    const _query = query(usersCollectionRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(_query);

    if (querySnapshot.empty) {
      addDoc(usersCollectionRef, {
        ...user,
        friends: [],
        invitationCode: new Date().getTime().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7),
      });
    }
  };

  const signInWithProvider = async (provider: any | null) => {
    if (!provider) return;

    try {
      const result = await signInWithPopup(auth, provider);

      if (result && result.user) {
        const idToken = await result.user.getIdToken();
        const firebaseUser: FirebaseUser = {
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        };
        
        addToDbIfNewUser(firebaseUser);
        setUser(firebaseUser);
        
        await fetch("/api/login", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const url = new URL(window.location.href);
        router.push(url.searchParams.get("redirect") ?? "/map");
      }
    } catch (error: Error | any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        setErrorMessage(
          "Un compte avec cette adresse email existe déjà, veuillez vous connecter avec un autre fournisseur de connexion"
        );
      } else {
        console.error("Error during sign-in:", error);
      }
    }
  };

  const tierceApps = [
    {
      name: "Google",
      icon: "/images/google-icon.svg",
      provider: new GoogleAuthProvider,
      active: true,
    },
    {
      name: "Facebook",
      icon: "/images/facebook-icon.svg",
      provider: new FacebookAuthProvider,
      active: true,
    },
    {
      name: "Microsoft",
      icon: "/images/microsoft-icon.svg",
      provider: new OAuthProvider("microsoft.com"),
      active: true,
    },
    {
      name: "X",
      icon: "/images/x-icon.svg",
      provider: new OAuthProvider("twitter.com"),
      active: true,
    },
    {
      name: "Apple",
      icon: "/images/apple-icon.svg",
      provider: null,
      active: false,
    },
  ];

  return (
    <div className="w-full h-[100svh] flex justify-center items-center lg:grid lg:grid-cols-2">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-glp-green-200 to-glp-green-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href="/">
              <Image
                src={"/images/main-logo-green.png"}
                alt="Logo G'Le Point"
                width={128}
                height={128}
                className="mx-auto"
              />
            </Link>
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
                  app.active
                    ? ""
                    : "opacity-50 cursor-not-allowed text-gray-600 border-gray-600 hover:bg-gray-600 hover:text-white"
                }`}
                onClick={() => signInWithProvider(app.provider)}
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
      <div className="h-full hidden bg-muted lg:block">
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
