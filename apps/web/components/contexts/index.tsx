import { FC, PropsWithChildren } from "react";
import { ProviderProvider } from "./providerContexts";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { SWRContext } from "./swr";

const GlobalProvider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <ProviderProvider>
      <SWRContext>{children}</SWRContext>
    </ProviderProvider>
  </ThemeProvider>
);

export default GlobalProvider;
