"use server";
import { cookies } from "next/headers";
import type { User } from "@/app/types/user";
import { validateCredentials } from "@/app/services/user";

export const handleLogin = async (user: User) => {
  const credentialsAreValid = validateCredentials(user);

  if (!credentialsAreValid) {
    cookies().set({ name: "user", value: "" });
    return false;
  }

  cookies().set({
    name: "user",
    value: JSON.stringify({
      email: user.email,
      connected: true,
    }),
    httpOnly: true,
  });
  return true;
};
