"use client";

import useSwr from "swr";
import { swrFetchHandler } from "@/lib/swr-utils";

export const useResources = () => {
  const { data, error, isLoading, isValidating } = useSwr(
    "/api/resources/count",
    swrFetchHandler(),
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
