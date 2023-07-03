"use client";

import useSwr from "swr";

export const useServiceStats = () => {
  const { data, error, isLoading, isValidating } = useSwr("/api/status", {
    refreshInterval: 1000,
  });

  return {
    speed: data?.speed,
    activeConnections: data?.activeConnections,
    totalResources: data?.totalResources,
    isLoading,
    isError: error,
    isValidating,
  };
};