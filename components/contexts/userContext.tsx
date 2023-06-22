"use client";

import { createContext, useState, FC, PropsWithChildren } from "react";

export type User = {
  email?: string;
  connected: boolean;
};

export type UserContextState = {
  user?: User;
  setUser: (user: User) => void;
};

export const UserContext = createContext<UserContextState>({
  setUser: (_: User) => { },
});

export const UserProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User>();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
