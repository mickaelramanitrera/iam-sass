import axios, { AxiosInstance } from 'axios';
import OIDCClient from '../client';
import Clients from './services/clients';
import Organizations from './services/organizations';
import Resources from './services/resources';
import Roles from './services/roles';
import Scopes from './services/scopes';
import Policies from './services/policies';
import Permissions from './services/permissions';
import Users from './services/users';
import { AdminRestClientError, sanitizeAxiosError } from '../errors';
import { HubClientNotFound } from './services/errors';

export type AdminRestClientOptions = {
  serverUrl: string;
  realmName: string;
  clientId: string;
  clientSecret: string;
  requestsTimeout?: number;
};

export default class AdminRestClient {
  private axiosClient: AxiosInstance;
  private oidcClient: OIDCClient;

  private accessToken?: string;
  public clientId: string;
  private clientSecret: string;
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
    clientId,
    clientSecret,
    serverUrl,
    realmName,
    requestsTimeout,
  }: AdminRestClientOptions) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.serverUrl = serverUrl;
    this.realmName = realmName;

    this.axiosClient = axios.create({
      baseURL: `${this.serverUrl}/admin/realms/${this.realmName}`,
      timeout: requestsTimeout ?? 60000,
    });

    this.oidcClient = new OIDCClient({
      serverUrl: this.serverUrl,
      realmName: this.realmName,
      requestsTimeout,
    });

    this.oidcBaseUrl = `${this.serverUrl}/realms/${this.realmName}`;

    // Handle refreshing the token when it expires
    // Handle also proper error display and sanitization so it does not leak sensitive datas
    this.axiosClient.interceptors.response.use(undefined, async (error) => {
      const status = error.response?.status || null;
      if (status === 401) {
        // we need to refresh the token
        this.accessToken = undefined;
        const authenticationSuccess = await this.authenticate();
        if (!authenticationSuccess) {
          return Promise.reject(new AdminRestClientError('Could not re-authenticate'));
        }

        // Perform the request again
        return this.axiosClient.request(error.config);
      }

      error.message =
        error?.response?.data?.errorMessage || error?.response?.data?.error || error.message;

      const sanitizedError = sanitizeAxiosError(error);

      return Promise.reject(new AdminRestClientError(sanitizedError.message, sanitizedError));
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

  async authenticate(): Promise<boolean> {
    try {
      if (this.accessToken) {
        return true;
      }

      // For authentication, we use the normal client as we want to consume
      // the authentication service from Keycloak to obtain an access token
      const { access_token } = await this.oidcClient.auth.authenticateWithClient(
        this.clientId,
        this.clientSecret
      );

      if (!access_token) {
        const NoAccessTokenError = new AdminRestClientError(
          'authenticate - No access_token in response from auth request'
        );
        console.error(NoAccessTokenError.message, NoAccessTokenError);
        return false;
      }

      this.accessToken = access_token;
      this.axiosClient.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
      return true;
    } catch (e) {
      const GeneralError = new AdminRestClientError('authenticate - Error', e);
      console.error(GeneralError.message, GeneralError);
      return false;
    }
  }

  getClient(): AxiosInstance {
    if (!this.accessToken) {
      throw new AdminRestClientError(
        'getClient - Client is missing an access token. You have to authenticate first'
      );
    }

    return this.axiosClient;
  }

  async getResourceServerBaseUrl(suffixPath?: string) {
    if (this.resourceServerBaseUrl) return `${this.resourceServerBaseUrl}${suffixPath}`;

    await this.authenticate();

    const client = await this.clients.get(this.clientId);
    if (!client) {
      throw new HubClientNotFound('getResourceServerBaseUrl');
    }

    const baseUrl = `clients/${client.id}/authz/resource-server/`;
    this.resourceServerBaseUrl = baseUrl;

    return `${this.resourceServerBaseUrl}${suffixPath}`;
  }
}
