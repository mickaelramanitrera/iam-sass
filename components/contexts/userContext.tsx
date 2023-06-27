"use client";

import { createContext, useState, FC, PropsWithChildren } from "react";
import * as ls from "local-storage";

export type User = {
  email?: string;
  connected: boolean;
};

export type UserContextState = {
  user?: User;
  setUser: (user: User) => void;
};

export const UserContext = createContext<UserContextState>({
  setUser: (_: User) => {},
});

export const UserProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  // load the user connected from localStorage
  const [user, setUser] = useState<User>(ls.get<User>("user"));

  const saveUser = (user: User) => {
    setUser(user);
    // also save in localstorage
    ls.set<User>("user", user);
  };

  return (
    <UserContext.Provider value={{ user, setUser: saveUser }}>
      {children}
    </UserContext.Provider>
  );
};
