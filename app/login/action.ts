"use server";

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

type CredentialsStore = { email: string; password: string }[];

export const validateCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
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
