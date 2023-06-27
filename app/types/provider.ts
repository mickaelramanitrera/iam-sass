"use server";

export type Provider = {
  name: string;
  id: number;
  url?: string;
  masterUsername?: string;
  masterPassword?: string;
};
