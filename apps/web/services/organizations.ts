"use client";

import useSwr from "swr";
import { swrFetchHandler } from "@/lib/swr-utils";

type Args = {
  token?: string;
  serverUrl?: string;
  realmName?: string;
};

export const useOrganizationsCount = ({
  token,
  serverUrl,
  realmName,
}: Args) => {
  const { data, error, isLoading, isValidating, mutate } = useSwr(
    "/api/organizations/count",
    swrFetchHandler<{ count: number }>(() => ({
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(serverUrl ? { ["x-kc-server-url"]: serverUrl } : {}),
        ...(realmName ? { ["x-kc-server-realm-name"]: realmName } : {}),
      },
    })),
    { refreshInterval: 5000, revalidateOnMount: true }
  );

  return {
    count: data?.count,
    isLoading,
    error,
    isValidating,
    mutate,
  };
};
