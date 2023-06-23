"use client";

import { ReactNode, useContext, useTransition } from "react";
import { Authenticated } from "@/components/hoc/authenticated";
import { Header } from "@/app/dashboard/header";
import { Aside } from "@/app/dashboard/aside";
import { handleLogout } from "@/app/dashboard/actions";
import { UserContext } from "@/components/contexts/userContext";
import { useToast } from "@/components/ui/use-toast";

type props = {
  header?: ReactNode;
  aside?: ReactNode;
};

const DashboardLayout: React.FC<React.PropsWithChildren<props>> = ({
  children,
  header,
  aside,
}) => (
  <div className="h-screen v-full grid grid-rows-[100px_auto] gap-y-16">
    <div className="w-full"></div>
    {header}
    <div className="container grid grid-cols-[minmax(260px,_1fr)_3fr]">
      {aside}
      <main>{children}</main>
    </div>
  </div>
);

const DashboardPage = () => {
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
    <DashboardLayout
      header={<Header onLogout={onLogout} logoutPending={isLogoutPending} />}
      aside={<Aside />}
    >
      My Dashboard
    </DashboardLayout>
  );
};

export default Authenticated(DashboardPage);
