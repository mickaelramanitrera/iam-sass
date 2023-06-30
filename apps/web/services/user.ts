"use client";

import useSwr from "swr";

export const useUsersCount = () => {
  const { data, error, isLoading, isValidating } = useSwr("/api/users/count", {
    refreshInterval: 7000,
  });

  return {
    count: data?.count,
    isLoading,
    isError: error,
    isValidating,
  };
};
