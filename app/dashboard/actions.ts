"use server";
import { cookies } from "next/headers";
import { logout } from "@/app/services/user";

export const handleLogout = async () => {
  logout();

  cookies().set({ name: "user", value: "" });

  return true;
};
