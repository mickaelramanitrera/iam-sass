import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { AdminClient } from "keycloak-lib";
import { routeHandler } from "@/app/api/utils";

export const GET = routeHandler(async (_: NextRequest) => {
  const headersList = headers();
  const bearerToken = headersList.get("authorization");
  const serverUrl = headersList.get("x-kc-server-url");

  // Fake datas if no keycloak provider credentials were sent
  if (!bearerToken || !serverUrl) {
    return NextResponse.json({ count: Math.floor(Math.random() * 30) + 1 });
  }

  const keycloakAdminClient = new AdminClient({
    access_token: bearerToken.replace(/bearer /gi, ""),
    realmName: "master",
    serverUrl,
  });

  const clients = await keycloakAdminClient.clients.list({});
  const organizations = clients.filter((client) => {
    const isANativeClient =
      client.name.startsWith("${") || client.clientId === "master-realm";

    return !isANativeClient;
  });

  return NextResponse.json({ count: organizations.length });
});
