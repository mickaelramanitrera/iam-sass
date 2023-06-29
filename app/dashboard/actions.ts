"use server";
import { cookies } from "next/headers";

export const handleLogout = async () => {
  cookies().set({ name: "user", value: "" });

  return true;
};
