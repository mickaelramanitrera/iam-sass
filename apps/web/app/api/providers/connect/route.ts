import { NextRequest, NextResponse } from "next/server";
import { OIDCClient } from "keycloak-lib";
import z from "zod";
import { routeHandler } from "@/app/api/utils";

const RequestBodySchema = z.object({
  url: z.string().url("Please input a valid url"),
  username: z.string().min(4, "Username MUST be 4 or more characters long"),
  pwd: z.string().min(4, "Password MUST be 4 or more characters long"),
});

export const POST = routeHandler(async (request: NextRequest) => {
  const bodyParseResults = RequestBodySchema.safeParse(await request.json());

  if (!bodyParseResults.success) {
    return NextResponse.json(
      { error: bodyParseResults.error },
      { status: 400 }
    );
  }

  const { url: serverUrl, pwd, username } = bodyParseResults.data;

  const keycloakClient = new OIDCClient({
    serverUrl,
    realmName: "master", // We always use the MASTER realm for now
  });

  const authResponse = await keycloakClient.auth.authenticateWithPassword(
    username,
    pwd
  );
  return NextResponse.json(authResponse);
});
