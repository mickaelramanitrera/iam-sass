"use client";

import { useContext } from "react";
import { CardInfo } from "@/components/dashboard/cardInfo";
import { useOrganizationsCount } from "@/services/organizations";
import { Icons } from "@/components/icons";
import { ProviderContext } from "@/components/contexts/providerContexts";

export const OrganizationsCard = () => {
  const { providers, currentProvider } = useContext(ProviderContext);
  const currentProviderToken = (
    providers.find((provider) => provider.id === currentProvider) ||
    providers[0]
  ).token;

  const { count, isLoading, isValidating } =
    useOrganizationsCount(currentProviderToken);

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
