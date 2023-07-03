import { KeycloakRoleObject } from '../../types';
import AuthenticatedService from './authenticatedService';
import { EmptyRestResponse } from './errors';

type ListFilters = {
  first?: number;
  max?: number;
  search?: string;
};

export default class Roles extends AuthenticatedService {
  /**
   * List current roles for current client
   * @returns {KeycloakRoleObject[]}
   */
  async list(filters?: ListFilters): Promise<KeycloakRoleObject[]> {
    const rolesResult = await this.adminRestClient.getClient().get<KeycloakRoleObject[]>('roles', {
      params: { ...(filters || {}) },
    });

    if (!rolesResult?.data) {
      throw new EmptyRestResponse('roles.list');
    }

    if (filters?.search) {
      return rolesResult.data.filter(
        (roleObject) => roleObject.name.toLowerCase() === filters.search?.toLowerCase()
      );
    }

    return rolesResult.data;
  }
}
