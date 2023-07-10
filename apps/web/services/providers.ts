"use client";

import useSWRMutation from "swr/mutation";
import { swrFetchHandler } from "@/lib/swr-utils";
import z from "zod";

const ArgsSchema = z.object({
  arg: z.object({
    username: z.string(),
    pwd: z.string(),
    url: z.string().url(),
    realmName: z.string(),
  }),
});

type Args = z.infer<typeof ArgsSchema>;

export const useProviderConnect = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/providers/connect",
    swrFetchHandler<{
      access_token: string;
    }>((args) => {
      const {
        arg: { url, username, pwd, realmName },
      }: Args = ArgsSchema.parse(args?.[1]);

      return {
        method: "POST",
        body: JSON.stringify({ url, username, pwd, realmName }),
      };
    })
  );

  return { isLoading: isMutating, trigger, error };
};
