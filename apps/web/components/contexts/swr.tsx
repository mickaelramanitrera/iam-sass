"use client";

import { FC, PropsWithChildren, useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SWRConfig } from "swr";
import { FetchError } from "@/lib/swr-utils";
import { useProviderConnect } from "@/services/providers";
import { ProviderContext } from "@/components/contexts/providerContexts";

export const SWRContext: FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { trigger: triggerProviderConnect, error: connectionError } =
    useProviderConnect();
  const {
    currentProvider: currentProviderId = 1,
    providers,
    refreshTokenFor,
  } = useContext(ProviderContext);

  const currentProvider = providers.find(
    (provider) => provider.id === currentProviderId
  );

  const handle401Error = async () => {
    const {
      username,
      pwd,
      url,
      id: currentProviderId,
      realmName,
    } = currentProvider!;
    const reconnectResults = await triggerProviderConnect({
      username,
      pwd,
      url,
      realmName,
    });

    let errorMessage = "";
    if (connectionError) {
      errorMessage = (connectionError as Error)?.message || "Unknown Error";
    }
    if (!reconnectResults?.access_token) {
      errorMessage = "No access token was retrieved from auto-reconnection";
    }

    if (errorMessage) {
      toast({
        variant: "destructive",
        title: "An error occurred while reconnecting",
        description: errorMessage,
      });

      return;
    }

    refreshTokenFor(currentProviderId, reconnectResults.access_token);
    toast({
      title: "Authentication to provider recovered",
    });
  };

  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: async (resource, init) => {
          const res = await fetch(resource, {
            next: { revalidate: 10 },
            ...init,
          });

          if (!res.ok) {
            throw new FetchError(
              "An error occured fetching the datas",
              res.status
            );
          }

          return res.json();
        },
        onError: async (error: FetchError, _) => {
          toast({
            variant: "destructive",
            title: "An error occurred",
            description: error?.message,
          });

          if (error.status === 403) {
            router.push("/login");
            return;
          }

          if (error.status === 401) {
            await handle401Error();
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
