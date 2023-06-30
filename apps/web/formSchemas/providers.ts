import z from "zod";

export const addProviderFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be 4 or more characters" })
    .trim(),
  url: z.string().url("Url must be a valid url starting with http(s)://"),
  masterUsername: z
    .string()
    .min(4, { message: "username must be 4 or more characters" }),
  masterPassword: z
    .string()
    .min(4, { message: "master password must be 4 or more characters" }),
});

export type providerFormValuesType = z.infer<typeof addProviderFormSchema>;
