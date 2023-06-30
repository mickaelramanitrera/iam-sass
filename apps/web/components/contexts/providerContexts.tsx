"use client";

import { createContext, useState, FC, PropsWithChildren } from "react";

export type User = {
  email?: string;
  connected: boolean;
};

export type ProviderContextState = {
  currentProvider?: number;
  setProvider: (providerId: number) => void;
};

export const ProviderContext = createContext<ProviderContextState>({
  setProvider: (_: number) => {},
});

export const ProviderProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [providerId, setProvider] = useState<number>();

  return (
    <ProviderContext.Provider
      value={{ currentProvider: providerId, setProvider }}
    >
      {children}
    </ProviderContext.Provider>
  );
};
