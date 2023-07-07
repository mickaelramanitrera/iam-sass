"use client";

import { createContext, useState, FC, PropsWithChildren } from "react";
import type { Provider } from "@/types/provider";

export type User = {
  email?: string;
  connected: boolean;
};

export type ProviderContextState = {
  currentProvider?: number;
  setProvider: (providerId: number) => void;
  providers: Provider[];
  addProvider: (provider: Provider) => void;
  refreshTokenFor: (providerId: number, token: string) => void;
};

export const ProviderContext = createContext<ProviderContextState>({
  setProvider: (_: number) => {},
  providers: [],
  addProvider: (_: Provider) => {},
  refreshTokenFor: (_providerId: number, _token: string) => {},
});

const fakeProvider = {
  name: "Keycloak Staging",
  id: 1,
  token: "",
  url: "",
  username: "",
  pwd: "",
};

export const ProviderProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [providerId, setProvider] = useState<number>();
  const [providers, setProviders] = useState<Provider[]>([
    { ...fakeProvider },
    { ...fakeProvider, name: "Keycloak Production", id: 2 },
  ]);

  return (
    <ProviderContext.Provider
      value={{
        currentProvider: providerId,
        setProvider,
        addProvider: (provider: Provider) => {
          setProviders([...providers, provider]);
        },
        refreshTokenFor: (providerId: number, token: string) => {
          const newProviders = [...providers];

          newProviders.map((p) => {
            if (p.id === providerId) {
              p.token = token;
            }

            return p;
          });

          setProviders(newProviders);
        },
        providers,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};
