"use client";

import useSwr from "swr";

export const useOrganizationsCount = () => {
  const { data, error, isLoading, isValidating } = useSwr(
    "/api/organizations/count",
    { refreshInterval: 5000 }
  );

  return {
    count: data?.count,
    isLoading,
    isError: error,
    isValidating,
  };
};
