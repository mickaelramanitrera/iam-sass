import AuthenticatedService from './authenticatedService';

export type KeycloakClientObject = {
  id: string;
  clientId: string;
  description?: string;
  enabled: boolean;
  secret: string;
};

export default class Clients extends AuthenticatedService {
  /**
   * Get a client from its clientId name
   * @param {string} clientId - the clientId, "hub" for ex
   * @returns {KeycloakClientObject || null}
   */
  async get(clientId: string): Promise<KeycloakClientObject | null> {
    const clients = await this.adminRestClient.getClient().get<KeycloakClientObject[]>(`clients`, {
      params: {
        clientId,
        deep: true,
      },
    });

    if (!clients?.data?.length) {
      return null;
    }

    return clients.data[0];
  }
}
