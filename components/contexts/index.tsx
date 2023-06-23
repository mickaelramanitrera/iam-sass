import { FC, PropsWithChildren } from "react";
import { UserProvider } from "./userContext";
import { ThemeProvider } from "@/components/contexts/theme-provider";

const GlobalProvider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <UserProvider>{children}</UserProvider>
  </ThemeProvider>
);

export default GlobalProvider;
