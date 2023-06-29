import { Metadata } from "next";
import { Container } from "@/components/container";
import { CardInfo } from "@/components/dashboard/cardInfo";
import { OrganizationsCard } from "@/components/dashboard/organizationsCard";
import { UsersCard } from "@/components/dashboard/usersCard";
import { AverageServiceSpeedCard } from "@/components/dashboard/averageServiceSpeedCard";
import { ActiveConnectionsCard } from "@/components/dashboard/activeConnectionsCard";

export const metadata: Metadata = {
  title: "Keycloak Kid - Dashboard",
  description: "Main dashboard",
};

const DashboardPage = () => {
  const datas = [
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
        <ActiveConnectionsCard />
        <AverageServiceSpeedCard />
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
