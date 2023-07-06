"use client";

import useSwr from "swr";
import { swrFetchHandler } from "@/lib/swr-utils";

export const useOrganizationsCount = (token?: string, serverUrl?: string) => {
  const { data, error, isLoading, isValidating } = useSwr(
    "/api/organizations/count",
    swrFetchHandler(() => ({
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(serverUrl ? { ["x-kc-server-url"]: serverUrl } : {}),
      },
    })),
    { refreshInterval: 5000 }
  );

  return {
    count: data?.count,
    isLoading,
    error,
    isValidating,
  };
};
