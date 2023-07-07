import axios, { AxiosInstance } from "axios";
import OIDCClient from "../client";
import Clients from "./services/clients";
import Organizations from "./services/organizations";
import Resources from "./services/resources";
import Roles from "./services/roles";
import Scopes from "./services/scopes";
import Policies from "./services/policies";
import Permissions from "./services/permissions";
import Users from "./services/users";
import { AdminRestClientError, sanitizeAxiosError } from "../errors";
import { HubClientNotFound } from "./services/errors";

export type AdminRestClientOptions = {
  serverUrl: string;
  realmName: string;
  access_token: string;
  requestsTimeout?: number;
};

export default class AdminRestClient {
  private axiosClient: AxiosInstance;
  public oidcClient: OIDCClient;

  private access_token?: string;
  private serverUrl: string;
  private realmName: string;

  public oidcBaseUrl: string;

  // services
  public clients: Clients;
  public resources: Resources;
  public scopes: Scopes;
  public organizations: Organizations;
  public users: Users;
  public permissions: Permissions;
  public policies: Policies;
  public roles: Roles;

  protected resourceServerBaseUrl?: string;

  constructor({
    serverUrl,
    realmName,
    requestsTimeout,
    access_token,
  }: AdminRestClientOptions) {
    this.serverUrl = serverUrl;
    this.realmName = realmName;
    this.access_token = access_token;

    this.axiosClient = axios.create({
      baseURL: `${this.serverUrl}/admin/realms/${this.realmName}`,
      timeout: requestsTimeout ?? 60000,
    });

    this.axiosClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${this.access_token}`;

    this.oidcClient = new OIDCClient({
      serverUrl: this.serverUrl,
      realmName: this.realmName,
      requestsTimeout,
    });

    this.oidcBaseUrl = `${this.serverUrl}/realms/${this.realmName}`;

    // Handle also proper error display and sanitization so it does not leak sensitive datas
    this.axiosClient.interceptors.response.use(undefined, async (error) => {
      error.message =
        error?.response?.data?.errorMessage ||
        error?.response?.data?.error ||
        error.message;

      error.status = error?.response?.status || 500;

      const sanitizedError = sanitizeAxiosError(error);

      return Promise.reject(
        new AdminRestClientError(sanitizedError.message, sanitizedError)
      );
    });

    this.clients = new Clients(this);
    this.resources = new Resources(this);
    this.scopes = new Scopes(this);
    this.organizations = new Organizations(this);
    this.users = new Users(this);
    this.permissions = new Permissions(this);
    this.policies = new Policies(this);
    this.roles = new Roles(this);
  }

  getAccessToken(): string {
    return this.access_token || "";
  }

  getClient(): AxiosInstance {
    if (!this.access_token) {
      throw new AdminRestClientError(
        "getClient - Client is missing an access token. You have to pass the access_token in constructor first"
      );
    }

    return this.axiosClient;
  }

  // Not needed for now
  async getResourceServerBaseUrl(suffixPath?: string) {
    if (this.resourceServerBaseUrl)
      return `${this.resourceServerBaseUrl}${suffixPath}`;

    // @TODO Fix this method when we start using it
    const client = await this.clients.get("any_client");
    if (!client) {
      throw new HubClientNotFound("getResourceServerBaseUrl");
    }

    const baseUrl = `clients/${client.id}/authz/resource-server/`;
    this.resourceServerBaseUrl = baseUrl;

    return `${this.resourceServerBaseUrl}${suffixPath}`;
  }
}
