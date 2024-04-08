"use client";

import { useAuthStore } from "@/store/authStore";
import { MapIcon, UsersIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { isAuthenticated, isAuthChecking, user } = useAuthStore();

  return (
    <>
      {isAuthChecking ? (
        <div>Chargement...</div>
      ) : (
        <nav className="fixed bottom-0 w-full h-[10%] bg-blue-500">
          <ul className="flex flex-row w-full h-full items-center justify-evenly gap-8">
            <li>
              <MapIcon className="h-8 w-8" />
              <Link href="/map">Carte</Link>
            </li>
            <li>
              <UsersIcon className="h-8 w-8" />
              <Link href="/friends">Amis</Link>
            </li>
            <li>
              {!isAuthenticated ? (
                <Link href="/login">Se connecter</Link>
              ) : (
                <Link href="/profile">
                  <Image
                    alt="image de profil Google"
                    src={user.photoURL}
                    width={50}
                    height={50}
                    className="rounded-full"
                    priority
                  />
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Navbar;
