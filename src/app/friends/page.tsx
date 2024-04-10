"use client";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Friends = () => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login");
    }
  }, [isAuthenticated]);

  return (
    <div>
      <h1>Friends</h1>
    </div>
  );
};

export default Friends;
