'use client';

import { useAuthStore } from "@/app/store/authStore";

const Navbar = () => {

  const {isAuthenticated} = useAuthStore();

  return (
    <nav className="absolute bottom-0 w-full h-10 bg-red-500">
      {isAuthenticated ? <p>Logged In</p> : <p>Logged Out</p>}
    </nav>
  );
}

export default Navbar;