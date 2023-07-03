import axios, { AxiosInstance } from 'axios';
import { OIDCClientError, sanitizeAxiosError } from '../errors';
import Auth from './auth';

export type ClientOptions = {
  serverUrl: string;
  realmName: string;
  requestsTimeout?: number;
};

class OIDCClient {
  private serverUrl: string;
  private realmName: string;
  private axiosClient: AxiosInstance;
  public baseUrl: string;

  public auth: Auth;

  constructor({ serverUrl, realmName, requestsTimeout }: ClientOptions) {
    this.serverUrl = serverUrl;
    this.realmName = realmName;
    this.baseUrl = `${this.serverUrl}/realms/${this.realmName}`;

    this.axiosClient = axios.create({
      baseURL: `${this.baseUrl}/protocol/openid-connect`,
      timeout: requestsTimeout ?? 60000,
    });

    this.axiosClient.interceptors.response.use(undefined, async (error) => {
      error.message =
        error?.response?.data?.errorMessage || error?.response?.data?.error || error.message;

      // Handle sanitizing axios error so it doesn't leak sensitive datas
      const sanitizedError = sanitizeAxiosError(error);

      return Promise.reject(new OIDCClientError(sanitizedError.message, sanitizedError));
    });

    this.auth = new Auth(this);
  }

  getClient() {
    return this.axiosClient;
  }
}

export default OIDCClient;
