"use client";

import { useContext } from "react";
import { UserContext } from "@/components/contexts/userContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Header = () => {
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    // @TODO implement proper servier-side logout
    // only perform a client-side logout for now
    setUser({ email: undefined, connected: false });
  };

  return (
    <header className="border-y border-slate-300 fixed w-full h-[100px] backdrop-blur">
      <div className="container flex h-full items-center justify-between">
        <div className="w-[50px] h-[50px] relative">
          <Image src="/logo.png" alt="sass_logo" fill priority />
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
};
