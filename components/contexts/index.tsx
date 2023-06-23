import { FC, PropsWithChildren } from "react";
import { UserProvider } from "./userContext";
import { ProviderProvider } from "./providerContexts";
import { ThemeProvider } from "@/components/contexts/theme-provider";

const GlobalProvider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <UserProvider>
      <ProviderProvider>{children}</ProviderProvider>
    </UserProvider>
  </ThemeProvider>
);

export default GlobalProvider;
