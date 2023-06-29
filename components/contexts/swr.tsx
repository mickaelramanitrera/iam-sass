"use client";

import { FC, PropsWithChildren } from "react";
import { SWRConfig } from "swr";

export const SWRContext: FC<PropsWithChildren<{}>> = ({ children }) => (
  <SWRConfig
    value={{
      refreshInterval: 3000,
      fetcher: (resource, init) =>
        fetch(resource, init).then((res) => res.json()),
    }}
  >
    {children}
  </SWRConfig>
);
