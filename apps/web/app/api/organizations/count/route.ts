import { NextRequest, NextResponse } from "next/server";
import { routeHandler } from "@/app/api/utils";
import { getKcHeaders, getKcAdminClient, listOrganizations } from "../helpers";

export const GET = routeHandler(async (_: NextRequest) => {
  const { bearerToken, serverUrl, realmName } = getKcHeaders();

  // Fake datas if no keycloak provider credentials were sent
  if (!bearerToken || !serverUrl || !realmName) {
    return NextResponse.json({ count: Math.floor(Math.random() * 30) + 1 });
  }

  const keycloakAdminClient = getKcAdminClient({
    bearerToken,
    realmName,
    serverUrl,
  });

  const organizations = await listOrganizations(keycloakAdminClient);

  return NextResponse.json({ count: organizations.length });
});
