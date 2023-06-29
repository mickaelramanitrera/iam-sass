"use client";

import { CardInfo } from "@/components/dashboard/cardInfo";
import { useOrganizationsCount } from "@/services/organizations";
import { Icons } from "@/components/icons";

export const OrganizationsCard = () => {
  const { count, isLoading, isValidating } = useOrganizationsCount();
  const getOrganizationsCountContent = () => {
    if (isLoading) {
      return <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />;
    }

    if (isValidating) {
      return (
        <div className="flex flex-row items-center text-gray-500">
          {count} <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
        </div>
      );
    }

    return count || "0";
  };

  return (
    <CardInfo
      title="Organizations"
      content={getOrganizationsCountContent()}
      icon="building"
      subContent={`+${(count * 1.78).toFixed(2)}% from last month`}
      link="/dashboard/organizations"
      loading={isLoading}
    />
  );
};
