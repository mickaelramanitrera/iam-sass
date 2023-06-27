"use client";

import { useContext, useTransition, FC, PropsWithChildren } from "react";
import { Authenticated } from "@/components/hoc/authenticated";
import { Header } from "@/app/dashboard/header";
import { Aside } from "@/app/dashboard/aside";
import { handleLogout } from "@/app/dashboard/actions";
import { UserContext } from "@/components/contexts/userContext";
import { useToast } from "@/components/ui/use-toast";

const DashboardLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isLogoutPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { setUser } = useContext(UserContext);

  const onLogout = () => {
    startTransition(async () => {
      const logoutSucceeded = await handleLogout();
      if (!logoutSucceeded) {
        toast({ title: "Logout failed", variant: "destructive" as const });
        return;
      }

      setUser({ email: undefined, connected: false });
      toast({ title: "Logout succeeded" });
    });
  };

  return (
    <div className="h-screen v-full grid grid-rows-[100px_auto] gap-y-16">
      <div className="w-full"></div>
      <Header onLogout={onLogout} logoutPending={isLogoutPending} />
      <div className="container grid grid-cols-[minmax(260px,_1fr)_3fr]">
        <Aside />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Authenticated(DashboardLayout);
