import { Metadata } from "next";
import { Container } from "@/components/container";
import { CardInfo } from "@/components/dashboard/cardInfo";
import { OrganizationsCard } from "@/components/dashboard/organizationsCard";
import { UsersCard } from "@/components/dashboard/usersCard";

export const metadata: Metadata = {
  title: "Keycloak Kid - Dashboard",
  description: "Main dashboard",
};

const DashboardPage = () => {
  const datas = [
    {
      title: "Active connections",
      content: "8 756",
      icon: "plug",
      subContent: "+1780.2% from last month",
      link: "/dashboard/settings",
      loading: false,
    },
    {
      title: "Average service speed",
      content: "12 cnx/s",
      icon: "radioTower",
      subContent: "12 seconds since last issue",
      link: undefined,
      loading: false,
    },
    {
      title: "Total resources",
      content: "8 357 564",
      icon: "boxes",
      subContent: "+5700% from last month",
      link: undefined,
      loading: false,
    },
  ] as const;

  return (
    <Container title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OrganizationsCard />
        <UsersCard />
        {datas.map((data, index) => (
          <CardInfo
            title={data.title}
            icon={data.icon}
            content={data.content}
            subContent={data.subContent}
            link={data.link}
            key={index}
            loading={data.loading}
          />
        ))}
      </div>
    </Container>
  );
};

export default DashboardPage;
