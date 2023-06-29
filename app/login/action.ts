"use server";
import { cookies } from "next/headers";
import type { User } from "@/types/user";
import { sleep } from "@/lib/time";

type CredentialsStore = User[];

export const validateCredentials = async ({
  email,
  password,
}: User): Promise<boolean> => {
  const allowedCredentials: CredentialsStore = [
    { email: "mickael@email.com", password: "12345678" },
    { email: "test@email.com", password: "00000000" },
  ];

  // Simulate latency to see visual FX
  await sleep(1000);

  return allowedCredentials.some(
    ({ email: mail, password: pwd }) => mail === email && pwd === password
  );
};

export const handleLogin = async (user: User) => {
  const credentialsAreValid = await validateCredentials(user);

  if (!credentialsAreValid) {
    cookies().set({
      name: "user",
      value: "",
      expires: new Date(),
    });
    return false;
  }

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);

  cookies().set({
    name: "user",
    value: JSON.stringify({
      email: user.email,
      connected: true,
    }),
    httpOnly: true,
    expires: expiration,
  });

  return true;
};
