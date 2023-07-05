"use client";

import useSwr from "swr";

export const useOrganizationsCount = (token?: string, serverUrl?: string) => {
  const { data, error, isLoading, isValidating } = useSwr(
    "/api/organizations/count",
    async (url) => {
      return fetch(url, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(serverUrl ? { ["x-kc-server-url"]: serverUrl } : {}),
        },
      }).then((res) => res.json());
    },
    { refreshInterval: 5000 }
  );

  return {
    count: data?.count,
    isLoading,
    isError: error,
    isValidating,
  };
};
