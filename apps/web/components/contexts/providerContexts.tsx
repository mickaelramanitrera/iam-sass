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
};

export const ProviderContext = createContext<ProviderContextState>({
  setProvider: (_: number) => {},
  providers: [],
  addProvider: (_: Provider) => {},
});

export const ProviderProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [providerId, setProvider] = useState<number>();
  const [providers, setProviders] = useState<Provider[]>([
    {
      name: "Keycloak Staging",
      id: 1,
      token: "",
      url: "",
    },
    { name: "Keycloak Production", id: 2, token: "", url: "" },
    { name: "Keycloak Local", id: 3, token: "", url: "" },
  ]);

  return (
    <ProviderContext.Provider
      value={{
        currentProvider: providerId,
        setProvider,
        addProvider: (provider: Provider) => {
          setProviders([...providers, provider]);
        },
        providers,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};
