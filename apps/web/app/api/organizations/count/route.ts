import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { AdminClient } from "keycloak-lib";

export const GET = async (_: NextRequest) => {
  const headersList = headers();
  const bearerToken = headersList.get("authorization");
  const serverUrl = headersList.get("x-kc-server-url");

  // Fake datas if no keycloak provider credentials were sent
  if (!bearerToken || !serverUrl) {
    return NextResponse.json({ count: Math.floor(Math.random() * 30) + 1 });
  }

  try {
    const keycloakAdminClient = new AdminClient({
      access_token: bearerToken.replace(/bearer /gi, ""),
      realmName: "master",
      serverUrl,
    });

    const clients = await keycloakAdminClient.clients.list({});
    const KC_SYSTEM_CLIENT_IDS = [
      "account",
      "account-console",
      "admin-cli",
      "broker",
      "master-realm",
      "security-admin-console",
    ];
    const organizations = clients.filter(
      (client) => !KC_SYSTEM_CLIENT_IDS.includes(client.clientId)
    );
    return NextResponse.json({ count: organizations.length });
  } catch (e) {
    return NextResponse.json({ error: (e as Error)?.message }, { status: 500 });
  }
};
