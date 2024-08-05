"use client";

import { Button } from "@/app/components/ui/button";
import { redirectTo } from "@/app/lib/actions";
import { logOut, useAuthStore } from "@/app/stores/authStore";
import { useEffect } from "react";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logOut();
      logout();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      redirectTo("/login");
    }
  }, [isAuthenticated]);

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
