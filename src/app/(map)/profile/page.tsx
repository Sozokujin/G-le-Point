/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { redirectTo } from "@/lib/actions";
import { updateUser } from "@/services/firebase/profil";
import { logOut, useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schéma de validation
const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().optional(),
});

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  // Initialisation du formulaire
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: user?.username || user?.displayName || "",
      bio: user?.bio || "",
    },
  });

  // Fonction de soumission du formulaire
  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (user && data.username) {
      user.username = data.username;
    }

    if (user && data.bio) {
      user.bio = data.bio;
    }

    if (user) {
      updateUser(user);
    }

    toast("You submitted the following values");
  }

  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.clear();
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
    <div className="flex justify-center items-center flex-col mt-12 md:mx-[25%]">
      <h1>Mon compte</h1>

      {user?.photoURL ? (
        <Image
          src={user?.photoURL ?? ""}
          alt={"Photo de profil de " + user?.displayName ?? "l'utilisateur"}
          width={64}
          height={64}
          className="rounded-full shadow-md"
        />
      ) : (
        <div className="flex justify-center items-center w-16 h-16 bg-primary text-white rounded-full shadow-md">
          <span className="text-xl">{user?.displayName?.charAt(0)}</span>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d'utilisateur</FormLabel>
                <FormControl>
                  <Input placeholder="Nom d'utilisateur" {...field} />
                </FormControl>
                <FormDescription>
                  Il s'agit de votre nom d'affichage public.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biographie</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your message here." {...field} />
                </FormControl>
                <FormDescription>
                  Il s'agit de votre biographie public.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            disabled
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder={user?.email ?? ""} {...field} />
                </FormControl>
                <FormDescription>Il s'agit de votre e-mail.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
        <Button onClick={handleLogout} variant="default" size="sm">
          Logout
        </Button>
        <Toaster position="top-right" />
      </Form>
    </div>
  );
};

export default Profile;
