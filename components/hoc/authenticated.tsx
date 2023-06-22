"use client";

import { FC, useContext } from "react";
import { UserContext } from "@/components/contexts/userContext";
import { redirect } from "next/navigation";

export const Authenticated = (ProtectedComponent: FC) => (props: any) => {
  const { user } = useContext(UserContext);

  if (!user?.connected) {
    redirect("/login");
  }

  return <ProtectedComponent {...props} />;
};
