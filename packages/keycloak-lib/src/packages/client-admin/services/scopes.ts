import AuthenticatedService from './authenticatedService';
import type { KeycloakScopePayload } from '../../types';
import { ClientNotFoundError, CreateScopeError, DeleteScopeError, ListScopesError } from './errors';

export type KeycloakScopeObject = {
  id: string;
  name: string;
  iconUri: string;
  displayName: string;
};

export default class Scopes extends AuthenticatedService {
  private async getScopeUrlByClientId(clientId: string): Promise<string> {
    const client = await this.adminRestClient.clients.get(clientId);
    if (!client) {
      const clientNotfoundError = new ClientNotFoundError(clientId);
      console.error(clientNotfoundError.message, clientNotfoundError);
      throw clientNotfoundError;
    }

    return `clients/${client.id}/authz/resource-server/scope`;
  }

  async list(clientId: string): Promise<KeycloakScopeObject[]> {
    try {
      const scopeEndpoint = await this.getScopeUrlByClientId(clientId);
      const scopes = await this.adminRestClient
        .getClient()
        .get<KeycloakScopeObject[]>(scopeEndpoint, {
          params: {
            deep: false,
          },
        });

      if (!scopes?.data?.length) {
        return [];
      }

      return scopes.data;
    } catch (e) {
      const listScopesError = new ListScopesError(clientId, (e as Error).message);
      console.error(listScopesError.message, listScopesError);
      throw listScopesError;
    }
  }

  async create(
    clientId: string,
    scopePayload: KeycloakScopePayload
  ): Promise<KeycloakScopeObject | null> {
    try {
      const scopeEndpoint = await this.getScopeUrlByClientId(clientId);
      const scopes = await this.adminRestClient
        .getClient()
        .post<KeycloakScopeObject>(scopeEndpoint, scopePayload);

      if (!scopes?.data) {
        console.warn('createScope : rest did not return any data');
        return null;
      }

      return scopes.data;
    } catch (e) {
      const createScopeError = new CreateScopeError(clientId, scopePayload, (e as Error)?.message);
      console.error(createScopeError.message, createScopeError);
      throw createScopeError;
    }
  }

  async delete(clientId: string, scopeId: string): Promise<void> {
    try {
      const scopeEndpoint = await this.getScopeUrlByClientId(clientId);
      await this.adminRestClient.getClient().delete<void>(`${scopeEndpoint}/${scopeId}`);
    } catch (e) {
      const deleteScopeError = new DeleteScopeError(clientId, scopeId, (e as Error)?.message);
      console.error(deleteScopeError.message, deleteScopeError);
      throw deleteScopeError;
    }
  }
}
