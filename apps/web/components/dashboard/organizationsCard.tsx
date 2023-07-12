"use client";

import { useContext, useMemo, useEffect } from "react";
import { CardInfo } from "@/components/dashboard/cardInfo";
import { useOrganizationsCount } from "@/services/organizations";
import { Icons } from "@/components/icons";
import { ProviderContext } from "@/components/contexts/providerContexts";

export const OrganizationsCard = () => {
  const { providers, currentProvider } = useContext(ProviderContext);
  const {
    token: currentProviderToken,
    url: serverUrl,
    realmName,
  } = providers.find((provider) => provider.id === currentProvider) ||
  providers[0];

  const { count, isLoading, isValidating, error, mutate } =
    useOrganizationsCount({
      token: currentProviderToken,
      serverUrl,
      realmName,
    });

  useEffect(() => {
    // Invalidate cache for orgs count on provider change
    // so that data is refetch right away for the new selected provider
    mutate(async () => ({ count: 0 }));
  }, [currentProvider, mutate]);

  const content = useMemo(() => {
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
  }, [isLoading, isValidating, count]);

  return (
    <CardInfo
      title="Organizations"
      content={content}
      icon="building"
      subContent={`+${((count || 0) * 1.78).toFixed(2)}% from last month`}
      link="/dashboard/organizations"
      loading={isLoading}
      errored={Boolean(error)}
      errorMessage={(error as Error)?.message}
    />
  );
};
