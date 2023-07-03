"use client";

import useSWRMutation from "swr/mutation";

type Args = { username: string; pwd: string; url: string };

export const useProviderConnect = () => {
  const { trigger, isMutating } = useSWRMutation(
    "/api/providers/connect",
    async (
      endpoint: string,
      { arg: { url, username, pwd } }: { arg: Args }
    ) => {
      return fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ url, username, pwd }),
      }).then((res) => res.json());
    }
  );

  return { isLoading: isMutating, trigger };
};
