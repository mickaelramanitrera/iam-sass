"use client";

import React, { useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import "./styles.css";

import { validateCredentials } from "./action";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please input a valid email" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be minimum 8 characters long" }),
});

const Page = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    // ✅ This will be type-safe and automatically validated.
    startTransition(async () => {
      const isValidCredentials = await validateCredentials(values);
      console.log("Credentials are valid", isValidCredentials);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-[100px] h-[100px] rounded-full border border-black flex justify-center items-center m-auto mb-8">
          <Icons.key />
        </div>

        <Card className="w-[350px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Use your email and password to get access
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default Page;
