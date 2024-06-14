"use client";
import Navbar from "@/components/navbar";
import { useAuthStore } from "@/stores/authStore";
import { usePathname } from "next/navigation";

const NavbarLayout = () => {
  const { isAuthenticated } = useAuthStore();

  const pathname = usePathname();

  const allowedPaths = ["/map", "/friends", "/profile"];

  const showNavbar = allowedPaths.includes(pathname);

  if (!isAuthenticated) {
    return null;
  }

  return showNavbar && <Navbar />;
};

export default NavbarLayout;
