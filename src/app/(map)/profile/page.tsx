"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/services/firebase/config";
import useUserStore from "@/stores/userStore";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const router = useRouter();
  const { clearUser } = useUserStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearUser();
      await fetch("/api/logout");
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <Button onClick={handleLogout} variant="default" size="sm">
        Logout
      </Button>
    </div>
  );
};

export default Profile;
