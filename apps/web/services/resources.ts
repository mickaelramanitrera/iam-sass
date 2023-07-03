"use client";

import useSwr from "swr";

export const useResources = () => {
  const { data, error, isLoading, isValidating } = useSwr(
    "/api/resources/count",
    {
      // Only revalidate data when component mounts
      refreshInterval: 0,
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: false,
    }
  );

  return {
    totalResources: data?.totalResources,
    isLoading,
    isError: error,
    isValidating,
  };
};
