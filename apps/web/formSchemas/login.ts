import z from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Please input a valid email" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be minimum 8 characters long" }),
});

export type loginFormValuesType = z.infer<typeof loginFormSchema>;
