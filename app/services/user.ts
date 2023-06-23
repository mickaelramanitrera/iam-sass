"use server";

import { sleep } from "@/lib/time";
import type { User } from "@/app/types/user";

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

export const logout = async (): Promise<boolean> => {
  // Simulate latency to see visual FX
  await sleep(1000);

  return true;
};
