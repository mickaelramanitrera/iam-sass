"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { useToast } from "@/components/ui/use-toast";
import "./styles.css";
import { loginFormSchema, type loginFormValuesType } from "@/formSchemas/login";

import { handleLogin } from "./action";

const LoginPage = () => {
  const router = useRouter();
  const form = useForm<loginFormValuesType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "test@email.com",
      password: "00000000",
    },
  });

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const toastLoginResults = (loginSuccess: boolean) => {
    const toastValues = {
      title: loginSuccess ? "Login succeeded" : "Login failed",
      // @TODO more fine grained error after login failure
      description: loginSuccess ? "" : "There was an error on login",
      variant: !loginSuccess ? ("destructive" as const) : ("default" as const),
    };

    toast(toastValues);
  };

  const onSubmit = (values: loginFormValuesType) => {
    // ✅ Values will be type-safe and automatically validated.
    startTransition(async () => {
      const loginSucceeded = await handleLogin(values);

      // show a visual sign of what happened with login (failed or not)
      toastLoginResults(loginSucceeded);

      if (loginSucceeded) {
        router.push("/dashboard");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-[100px] h-[100px] flex justify-center items-center m-auto mb-8">
          <Image
            className="dark:grayscale"
            src="/logo.png"
            alt="sass_logo"
            width={100}
            height={100}
            priority
          />
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
                      <Input placeholder="mickael@example.com" {...field} />
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

export default LoginPage;
