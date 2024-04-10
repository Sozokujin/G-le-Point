"use client";

import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Profile = () => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login");
    }
  }, [isAuthenticated]);

  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
};

export default Profile;
