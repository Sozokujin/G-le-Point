"use client";

import { useAuthStore } from "@/app/store/authStore";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { isAuthenticated, isAuthChecking, user } = useAuthStore();

  if (!isAuthChecking && user) {
    console.log(user.displayName, user.photoURL);
  }

  return (
    <>
      {isAuthChecking ? (
        <div>Chargement...</div>
      ) : (
        <nav className="fixed bottom-0 w-full h-[10%] bg-blue-500">
          <ul className="flex flex-row w-full h-full items-center justify-evenly gap-8">
            <li>
              <Link href="/map">Carte</Link>
            </li>
            <li>
              <Link href="/friends">Amis</Link>
            </li>
            <li>
              <Link href="/profile">
                <Image
                  alt="image de profile google"
                  src={user.photoURL}
                  width={"50"}
                  height={"50"}
                  className="rounded-full"
                ></Image>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Navbar;
