"use client";

import { Container } from "@/components/container";
import { useContext, useEffect, FC, ReactElement } from "react";
import { ProviderContext } from "@/components/contexts/providerContexts";
import { useOrganizationsList } from "@/services/organizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { KeycloakOrganizationObject } from "keycloak-lib";
import { Skeleton } from "@/components/ui/skeleton";

const OrganizationsPage = () => {
  const { currentProvider, providers } = useContext(ProviderContext);
  const {
    token: currentProvidertoken,
    url: serverUrl,
    realmName,
    name: providerName,
  } = providers.find((p) => p.id === currentProvider) || providers[0];

  const { organizations, mutate, isLoading, isValidating } =
    useOrganizationsList({
      token: currentProvidertoken,
      serverUrl,
      realmName,
    });

  useEffect(() => {
    // Invalidate cache for orgs list on provider change
    // so that data is refetch right away for the new selected provider
    mutate(async () => ({ organizations: [] }));
  }, [currentProvider, mutate]);

  return (
    <Container title="Organizations">
      <div className="my-4">
        <h4 className="italic">{providerName}</h4>
        <OrganizationCardsList
          organizations={organizations}
          loading={isLoading || isValidating}
        />
      </div>
    </Container>
  );
};

const OrganizationCardsList: FC<{
  organizations: KeycloakOrganizationObject[];
  loading: boolean;
}> = ({ organizations, loading }) => {
  let cardsList: ReactElement[];
  if (loading) {
    cardsList = Object.keys(new Array(6).fill(6)).map((id) => (
      <Card
        key={id}
        className="hover:-translate-y-1 transition ease-in-out hover:bg-accent backdrop-blur"
        role="button"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>
            <Skeleton className="h-5 w-[250px]" />
          </CardTitle>
          <Icons.gitHub className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-[150px]" />
        </CardContent>
      </Card>
    ));
  } else {
    cardsList = organizations.map((org, id) => (
      <Card
        key={id}
        className="hover:-translate-y-1 transition ease-in-out hover:bg-accent backdrop-blur"
        role="button"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{org.name}</CardTitle>
          <Icons.gitHub className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {org?.description || <span className="italic">(no description)</span>}
        </CardContent>
      </Card>
    ));
  }

  return <div className="my-6 grid gap-4 grid-cols-1">{cardsList}</div>;
};

export default OrganizationsPage;
