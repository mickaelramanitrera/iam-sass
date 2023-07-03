import { Metadata } from "next";
import { Container } from "@/components/container";
import { OrganizationsCard } from "@/components/dashboard/organizationsCard";
import { UsersCard } from "@/components/dashboard/usersCard";
import { AverageServiceSpeedCard } from "@/components/dashboard/averageServiceSpeedCard";
import { ActiveConnectionsCard } from "@/components/dashboard/activeConnectionsCard";
import { ResourcesCard } from "@/components/dashboard/resourcesCard";

export const metadata: Metadata = {
  title: "Keycloak Kid - Dashboard",
  description: "Main dashboard",
};

const DashboardPage = () => {
  return (
    <Container title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OrganizationsCard />
        <UsersCard />
        <ActiveConnectionsCard />
        <AverageServiceSpeedCard />
        <ResourcesCard />
      </div>
    </Container>
  );
};

export default DashboardPage;
