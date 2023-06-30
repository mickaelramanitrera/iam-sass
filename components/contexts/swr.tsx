"use client";

import { FC, PropsWithChildren } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SWRConfig } from "swr";

export const SWRContext: FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: async (resource, init) => {
          const res = await fetch(resource, {
            ...init,
            cache: "no-store",
            next: { revalidate: 0 },
          });

          if (!res.ok) {
            const error = new Error("An error occured fetching the datas");

            (error as any).info = await res.json();
            (error as any).status = res.status;

            throw error;
          }

          return res.json();
        },
        onError: (error, _) => {
          toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Your authentication has expired, please login again",
          });

          if (error.status === 403) {
            router.push("/login");
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
