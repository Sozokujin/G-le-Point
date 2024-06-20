"use client";

import { Button } from "@/components/ui/button";
import { redirectTo } from "@/lib/actions";
import { googleLogOut, useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await googleLogOut();
      logout();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      redirectTo("/map/login");
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
