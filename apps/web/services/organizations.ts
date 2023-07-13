"use client";

import useSwr from "swr";
import { swrFetchHandler } from "@/lib/swr-utils";
import type { KeycloakOrganizationObject } from "keycloak-lib";

type Args = {
  token?: string;
  serverUrl?: string;
  realmName?: string;
};

const useGetOrganizationSwr = <T>(
  { token, serverUrl, realmName, url }: Args & { url: string },
  swrOptions?: Record<string, any>
) => {
  return useSwr(
    url,
    swrFetchHandler<T>(() => ({
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(serverUrl ? { ["x-kc-server-url"]: serverUrl } : {}),
        ...(realmName ? { ["x-kc-server-realm-name"]: realmName } : {}),
      },
    })),
    { refreshInterval: 5000, revalidateOnMount: true, ...swrOptions }
  );
};

export const useOrganizationsCount = ({
  token,
  serverUrl,
  realmName,
}: Args) => {
  const { data, error, isLoading, isValidating, mutate } =
    useGetOrganizationSwr<{ count?: number }>({
      token,
      serverUrl,
      realmName,
      url: "/api/organizations/count",
    });

  return {
    count: data?.count,
    isLoading,
    error,
    isValidating,
    mutate,
  };
};

export const useOrganizationsList = ({ token, serverUrl, realmName }: Args) => {
  const { data, error, isLoading, isValidating, mutate } =
    useGetOrganizationSwr<{ organizations?: KeycloakOrganizationObject[] }>(
      {
        token,
        serverUrl,
        realmName,
        url: "/api/organizations/list",
      },
      { refreshInterval: 0, revalidateOnMount: false, revalidateOnFocus: false }
    );

  return {
    organizations: data?.organizations || [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
