"use client";
import { Button } from "@/components/ui/button";
import { auth } from "@/db/firebase";
import { googleSignIn, useAuthStore } from "@/store/authStore";
import { browserLocalPersistence, setPersistence } from "firebase/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Login = () => {
  const { isAuthenticated, login, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      redirect("/map");
    }
  }, [isAuthenticated]);

  const handleSignIn = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const authUser = await googleSignIn();
      if (authUser && authUser.user) {
        login(authUser.user);
        redirect("/map");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <Button variant="default" size="sm" onClick={handleSignIn}>
          Login
        </Button>
      </div>

      {isAuthenticated && (
        <div>
          <h1>Welcome {user.displayName}</h1>
        </div>
      )}
    </>
  );
};

export default Login;
