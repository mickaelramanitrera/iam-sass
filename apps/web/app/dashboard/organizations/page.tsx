"use client";

import { Container } from "@/components/container";
import { useContext, useEffect } from "react";
import { ProviderContext } from "@/components/contexts/providerContexts";
import { useOrganizationsList } from "@/services/organizations";
import { OrganizationCardsList } from "@/components/dashboard/organizations/organizationCardsList";

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

export default OrganizationsPage;
