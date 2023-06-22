"use client";

import { ReactNode } from "react";
import { Authenticated } from "@/components/hoc/authenticated";
import { Header } from "@/app/dashboard/header";
import { Aside } from "@/app/dashboard/aside";

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

const DashboardPage = () => (
  <DashboardLayout header={<Header />} aside={<Aside />}>
    My Dashboard
  </DashboardLayout>
);

export default Authenticated(DashboardPage);
