"use server";
import { cookies } from "next/headers";

export const handleLogout = async () => {
  cookies().set({ name: "user", value: "", expires: new Date() });

  return true;
};
