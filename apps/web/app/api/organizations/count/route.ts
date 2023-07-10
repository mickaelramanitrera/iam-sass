import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { AdminClient } from "keycloak-lib";
import { routeHandler } from "@/app/api/utils";

export const GET = routeHandler(async (_: NextRequest) => {
  const headersList = headers();
  const bearerToken = headersList.get("authorization");
  const serverUrl = headersList.get("x-kc-server-url");
  const realmName = headersList.get("x-kc-server-realm-name");

  // Fake datas if no keycloak provider credentials were sent
  if (!bearerToken || !serverUrl || !realmName) {
    return NextResponse.json({ count: Math.floor(Math.random() * 30) + 1 });
  }

  const keycloakAdminClient = new AdminClient({
    access_token: bearerToken.replace(/bearer /gi, ""),
    realmName,
    serverUrl,
  });

  const clients = await keycloakAdminClient.clients.list({});
  const organizations = clients.filter((client) => {
    const isANativeClient =
      client.name.startsWith("${") ||
      ["master-realm", `${realmName}-realm`].includes(client.clientId);

    return !isANativeClient;
  });

  return NextResponse.json({ count: organizations.length });
});
