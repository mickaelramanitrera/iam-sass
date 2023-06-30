"use client";

import { FC, ReactNode } from "react";
import { Icons } from "@/components/icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type cardInfoProps = {
  title: string;
  content: string | ReactNode;
  subContent: string | ReactNode;
  icon: keyof typeof Icons;
  link?: string;
  loading?: boolean;
};

export const CardInfo: FC<cardInfoProps> = ({
  title,
  content,
  subContent,
  icon,
  link,
  loading,
}) => {
  const CardIcon = Icons[icon];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading && <Skeleton className="w-[31px] h-[28px]" />}
        {!loading && <div className="text-2xl font-bold">{content}</div>}

        {loading && <Skeleton className="w-[136px] h-[16px] mt-1" />}
        {!loading && (
          <p className="text-xs text-muted-foreground">{subContent}</p>
        )}
      </CardContent>
      {link && (
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href={link} className="w-full flex justify-between text-xs">
              View {title.toLowerCase()}{" "}
              <Icons.chevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
