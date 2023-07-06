"use client";

import useSwr from "swr";
import { swrFetchHandler } from "@/lib/swr-utils";

export const useUsersCount = () => {
  const { data, error, isLoading, isValidating } = useSwr(
    "/api/users/count",
    swrFetchHandler<{ count: number }>(),
    {
      refreshInterval: 7000,
    }
  );

  return {
    count: data?.count,
    isLoading,
    isError: error,
    isValidating,
  };
};
