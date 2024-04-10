"use client";

import { useAuthStore } from "@/stores/authStore";
import { MapIcon, UsersIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { isAuthenticated, isAuthChecking, user } = useAuthStore();

  return (
    <nav className="fixed bottom-0 w-full h-[10%]">
      <ul className="flex flex-row w-full h-full items-center justify-evenly gap-8">
        <li>
          <Link href="/map">
            <MapIcon className="h-8 w-8 mx-auto" />
            Carte
          </Link>
        </li>
        <li>
          <Link href="/friends">
            <UsersIcon className="h-8 w-8 mx-auto" />
            Amis
          </Link>
        </li>

        {!isAuthenticated ? null : (
          <li>
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
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
