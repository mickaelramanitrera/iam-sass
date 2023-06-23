import { FC } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Props = { onLogout: () => void; logoutPending?: boolean };

export const Header: FC<Props> = ({ onLogout, logoutPending }) => {
  return (
    <header className="border-y border-slate-300 fixed w-full h-[100px] backdrop-blur">
      <div className="container flex h-full items-center justify-between">
        <div className="w-[50px] h-[50px] relative">
          <Image src="/logo.png" alt="sass_logo" fill priority />
        </div>
        <Button variant="ghost" onClick={onLogout} disabled={logoutPending}>
          {logoutPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </header>
  );
};
