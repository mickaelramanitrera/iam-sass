import qs from "qs";
import { OIDCClientError } from "../errors";
import type OIDCClient from "./index";

type AuthenticateWithPasswordResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
};

export default class Auth {
  constructor(private oidcClient: OIDCClient) { }

  async authenticateWithClient(
    clientId: string,
    clientSecret: string
  ): Promise<{ access_token?: string }> {
    const authResponse = await this.oidcClient.getClient().post(
      "/token",
      qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      })
    );

    if (!authResponse?.data) {
      throw new OIDCClientError(
        "authenticateWithClient - No response from auth request"
      );
    }

    return authResponse.data;
  }

  async authenticateWithPassword(
    username: string,
    password: string
  ): Promise<AuthenticateWithPasswordResponse> {
    const authResponse = await this.oidcClient
      .getClient()
      .post<AuthenticateWithPasswordResponse>(
        "token",
        qs.stringify({
          client_id: "admin-cli",
          username,
          password,
          grant_type: "password",
        })
      );

    if (!authResponse?.data) {
      throw new OIDCClientError(
        "authetnticateWithPassword - No response from auth request"
      );
    }

    return authResponse.data;
  }
}
