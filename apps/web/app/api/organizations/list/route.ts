import { NextRequest, NextResponse } from "next/server";
import { routeHandler } from "@/app/api/utils";
import type { KeycloakOrganizationObject } from "keycloak-lib";
import { getKcHeaders, getKcAdminClient, listOrganizations } from "../helpers";

export const GET = routeHandler(async (_: NextRequest) => {
  const { bearerToken, serverUrl, realmName } = getKcHeaders();

  // Fake datas if no keycloak provider credentials were sent
  if (!bearerToken || !serverUrl || !realmName) {
    const fakeOrganization: KeycloakOrganizationObject = {
      id: "xxxxxx",
      name: "My org",
      description: "My description",
      path: "xxxxxxx",
    };
    return NextResponse.json({
      organizations: [
        { ...fakeOrganization, description: "" },
        { ...fakeOrganization, name: "My fake org" },
      ],
    });
  }

  const keycloakAdminClient = getKcAdminClient({
    bearerToken,
    realmName,
    serverUrl,
  });

  return NextResponse.json({
    organizations: await listOrganizations(keycloakAdminClient),
  });
});
