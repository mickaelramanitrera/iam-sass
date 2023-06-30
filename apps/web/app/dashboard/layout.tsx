"use client";

import { useContext, useTransition, FC, PropsWithChildren } from "react";
import { Header } from "@/components/dashboard/header";
import { Aside } from "@/components/dashboard/aside";
import { handleLogout } from "@/app/dashboard/actions";
import { useToast } from "@/components/ui/use-toast";
import { MobileMenu } from "@/components/responsiveMenu";
import { useRouter } from "next/navigation";

const DashboardLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isLogoutPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const onLogout = () => {
    startTransition(async () => {
      const logoutSucceeded = await handleLogout();
      if (!logoutSucceeded) {
        toast({ title: "Logout failed", variant: "destructive" as const });
        return;
      }

      toast({ title: "Logout succeeded" });
      router.push("/login");
    });
  };

  return (
    <div className="h-screen v-full grid grid-rows-[100px_auto] gap-y-16">
      <div className="w-full"></div>
      <Header onLogout={onLogout} logoutPending={isLogoutPending} />
      <div className="container grid md:grid-cols-[minmax(260px,_1fr)_3fr]">
        <Aside className="hidden md:block" />
        <main>
          <MobileMenu className="block md:hidden mb-8" onLogout={onLogout} />
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
