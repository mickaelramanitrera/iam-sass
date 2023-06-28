import { FC } from "react";
import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Container } from "@/components/container";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Keycloak Kid - Dashboard",
  description: "Main dashboard",
};

const DashboardPage = () => (
  <Container title="Dashboard">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {CARD_DATAS.map((data, index) => (
        <CardInfo
          title={data.title}
          icon={data.icon}
          content={data.content}
          subContent={data.subContent}
          link={data.link}
          key={index}
        />
      ))}
    </div>
  </Container>
);

type cardInfoProps = {
  title: string;
  content: string;
  subContent: string;
  icon: keyof typeof Icons;
  link?: string;
};

const CardInfo: FC<cardInfoProps> = ({
  title,
  content,
  subContent,
  icon,
  link,
}) => {
  const CardIcon = Icons[icon];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{content}</div>
        <p className="text-xs text-muted-foreground">{subContent}</p>
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

const CARD_DATAS = [
  {
    title: "Organizations",
    content: "18",
    icon: "building",
    subContent: "+25.9% from last month",
    link: "/dashboard/organizations",
  },
  {
    title: "Users",
    content: "+2350",
    icon: "users",
    subContent: "+180.2% from last month",
    link: "/dashboard/users",
  },
  {
    title: "Active connections",
    content: "8 756",
    icon: "plug",
    subContent: "+1780.2% from last month",
    link: "/dashboard/settings",
  },
  {
    title: "Average service speed",
    content: "12 cnx/s",
    icon: "radioTower",
    subContent: "12 seconds since last issue",
    link: undefined,
  },
  {
    title: "Total resources",
    content: "8 357 564",
    icon: "boxes",
    subContent: "+5700% from last month",
    link: undefined,
  },
] as const;

export default DashboardPage;
