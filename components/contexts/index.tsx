import { FC, PropsWithChildren } from "react";
import { UserProvider } from "./userContext";

const GlobalProvider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <UserProvider>{children}</UserProvider>
);

export default GlobalProvider;
