import AuthenticatedService from './authenticatedService';
import type {
  KeycloakRolePayload,
  KeycloakUserObject,
  KeycloakUserCreationPayload,
  KeycloakUserUpdatePayload,
} from '../../types';
import { RoleNotProvideError } from './errors';

type ListFilters = {
  email?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  exact?: boolean;
  first?: number;
  firstName?: string;
  idpAlias?: string;
  idpUserId?: string;
  lastName?: string;
  max?: number;
  q?: string;
  search?: string;
  username?: string;
};

export default class Users extends AuthenticatedService {
  async list(filters?: ListFilters): Promise<KeycloakUserObject[]> {
    const usersResponse = await this.adminRestClient
      .getClient()
      .get<KeycloakUserObject[]>('users', {
        params: filters || {},
      });

    if (!usersResponse.data) {
      console.warn('users.list : rest did not return any data');
      return [];
    }

    return usersResponse.data;
  }

  async findOneByEmail(email: string): Promise<KeycloakUserObject | null> {
    const users = await this.list({ username: email, exact: true });
    if (!users.length) {
      console.warn(`users.findOneByEmail: user not found : email:${email}`);
      return null;
    }
    return users[0];
  }

  async get(userId: string): Promise<KeycloakUserObject | null> {
    const userResponse = await this.adminRestClient
      .getClient()
      .get<KeycloakUserObject | null>(`users/${userId}`);

    return userResponse.data;
  }

  private async assignUserRole(
    role: KeycloakRolePayload,
    user: KeycloakUserObject
  ): Promise<boolean> {
    if (!role) {
      throw new RoleNotProvideError(user.username);
    }
    await this.adminRestClient
      .getClient()
      .post(`users/${user.id}/role-mappings/realm`, [{ name: role.name, id: role.id }]);
    return true;
  }

  async create(user: KeycloakUserCreationPayload): Promise<KeycloakUserObject | null> {
    await this.adminRestClient.getClient().post(`users`, {
      email: user.email,
      username: user.email,
      credentials: [{ type: 'password', value: user.password, temporary: false }],
      enabled: user.enabled ?? true,
    });
    const createdUser = await this.findOneByEmail(user.email);
    if (createdUser && user.role) {
      await this.assignUserRole(user.role, createdUser);
    }
    return createdUser;
  }

  async update(id: string, userPayload: KeycloakUserUpdatePayload) {
    await this.adminRestClient.getClient().put(`users/${id}`, {
      enabled: userPayload.enabled,
    });
    return true;
  }

  async delete(userId: string) {
    await this.adminRestClient.getClient().delete(`users/${userId}`);
    return true;
  }
}
