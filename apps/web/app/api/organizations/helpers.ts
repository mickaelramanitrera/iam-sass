import { headers } from "next/headers";
import { AdminClient } from "keycloak-lib";

type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type KCHeaders = {
  bearerToken: string | null;
  serverUrl: string | null;
  realmName: string | null;
};

export const getKcHeaders: () => KCHeaders = () => {
  const headersList = headers();
  const bearerToken = headersList.get("authorization");
  const serverUrl = headersList.get("x-kc-server-url");
  const realmName = headersList.get("x-kc-server-realm-name");

  return { bearerToken, serverUrl, realmName };
};

type GetKcAdminClientArgs = NonNullableFields<KCHeaders>;

export const getKcAdminClient: (args: GetKcAdminClientArgs) => AdminClient = ({
  bearerToken,
  serverUrl,
  realmName,
}) => {
  return new AdminClient({
    access_token: bearerToken.replace(/bearer /gi, ""),
    realmName,
    serverUrl,
  });
};

export const listOrganizations = async (
  adminClient: AdminClient,
  clientId?: string
) => {
  const clients = await adminClient.clients.list({ clientId });

  const organizations = clients.filter((client) => {
    const isANativeClient =
      client.name.startsWith("${") ||
      ["master-realm"].includes(client.clientId);

    return !isANativeClient;
  });

  return organizations;
};
