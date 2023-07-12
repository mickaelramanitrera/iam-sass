"use client";

import { Container } from "@/components/container";
import { useContext, useEffect } from "react";
import { ProviderContext } from "@/components/contexts/providerContexts";
import { useOrganizationsList } from "@/services/organizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

const OrganizationsPage = () => {
  const { currentProvider, providers } = useContext(ProviderContext);
  const {
    token: currentProvidertoken,
    url: serverUrl,
    realmName,
    name: providerName,
  } = providers.find((p) => p.id === currentProvider) || providers[0];

  const { organizations, mutate } = useOrganizationsList({
    token: currentProvidertoken,
    serverUrl,
    realmName,
  });

  useEffect(() => {
    // Invalidate cache for orgs list on provider change
    // so that data is refetch right away for the new selected provider
    mutate(async () => ({ organizations: [] }));
  }, [currentProvider]);

  return (
    <Container title="Organizations">
      <div className="my-4">
        <h4 className="italic">{providerName}</h4>

        <div className="my-6 grid gap-4 grid-cols-1">
          {organizations.map((org) => (
            <Card className="cursor-pointer hover:-translate-y-1 transition ease-in-out hover:bg-accent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>{org.name}</CardTitle>
                <Icons.gitHub className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {org?.description || (
                  <span className="italic">(no description)</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default OrganizationsPage;
