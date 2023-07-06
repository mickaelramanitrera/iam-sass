"use client";

import useSwr from "swr";
import { swrFetchHandler } from "@/lib/swr-utils";

export const useServiceStats = () => {
  const { data, error, isLoading, isValidating } = useSwr(
    "/api/status",
    swrFetchHandler(),
    {
      refreshInterval: 1000,
    }
  );

  return {
    speed: data?.speed,
    activeConnections: data?.activeConnections,
    isLoading,
    isError: error,
    isValidating,
  };
};
