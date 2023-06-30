import { FC, PropsWithChildren } from "react";
import { ProviderProvider } from "./providerContexts";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { SWRContext } from "./swr";

const GlobalProvider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <SWRContext>
      <ProviderProvider>{children}</ProviderProvider>
    </SWRContext>
  </ThemeProvider>
);

export default GlobalProvider;
