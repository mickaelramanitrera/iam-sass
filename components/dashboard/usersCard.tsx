"use client";

import { CardInfo } from "@/components/dashboard/cardInfo";
import { useUsersCount } from "@/services/user";
import { Icons } from "@/components/icons";

export const UsersCard = () => {
  const { count, isLoading, isValidating } = useUsersCount();
  const getUsersCountContent = () => {
    if (isLoading) {
      return <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />;
    }

    if (isValidating) {
      return (
        <div className="flex flex-row items-center text-slate-800">
          {count} <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
        </div>
      );
    }

    return count || "0";
  };

  return (
    <CardInfo
      title="Users"
      content={getUsersCountContent()}
      icon="users"
      subContent={`+${(count * 1.23).toFixed(2)}% from last month`}
      link="/dashboard/users"
      loading={isLoading}
    />
  );
};