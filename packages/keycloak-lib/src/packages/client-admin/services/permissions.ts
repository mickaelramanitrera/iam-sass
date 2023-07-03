import { AdminRestClientError } from '../../errors';
import {
  KeycloakBasePolicyObject,
  KeycloakDecisionStrategyType,
  KeycloakResourceObject,
  KeycloakPartialPermissionObject,
  KeycloakPermissionObject,
} from '../../types';
import AuthenticatedService from './authenticatedService';
import { EmptyRestResponse } from './errors';
import { KeycloakScopeObject } from './scopes';

type ListFilters = {
  first?: number;
  max?: number;
  resource?: string;
  scope?: string;
  name?: string;
};

type PermissionCreatePayload = Omit<KeycloakPermissionObject, 'id' | 'type' | 'logic'>;

type FindOrCreatePermissionArgs = {
  name: string;
  policiesIds: string[];
  scopes: string[];
  projectId: string;
};

export default class Permissions extends AuthenticatedService {
  /**
   * List permissions based on filters
   *
   * @param {ListFilters} filters - The filters to use on permissions
   * @returns {KeycloakPartialPermissionObject}
   */
  async list(filters?: ListFilters): Promise<KeycloakPartialPermissionObject[]> {
    const permissionResult = await this.adminRestClient
      .getClient()
      .get<KeycloakPartialPermissionObject[]>(
        await this.adminRestClient.getResourceServerBaseUrl('permission'),
        {
          params: { ...(filters || {}) },
        }
      );

    return permissionResult?.data || [];
  }

  /**
   * Get the full permission object by its id
   *
   * @param {string} id - Id of permission
   * @returns {KeycloakPermissionObject}
   */
  async get(id: string): Promise<KeycloakPermissionObject> {
    const [permission, resources, associatedPolicies, scopes] = await Promise.all([
      this.adminRestClient
        .getClient()
        .get<KeycloakPermissionObject>(
          `${await this.adminRestClient.getResourceServerBaseUrl('permission/scope')}/${id}`
        ),
      this.adminRestClient
        .getClient()
        .get<KeycloakResourceObject[]>(
          `${await this.adminRestClient.getResourceServerBaseUrl('policy')}/${id}/resources`
        ),
      this.adminRestClient
        .getClient()
        .get<KeycloakBasePolicyObject[]>(
          `${await this.adminRestClient.getResourceServerBaseUrl(
            'policy'
          )}/${id}/associatedPolicies`
        ),
      this.adminRestClient
        .getClient()
        .get<KeycloakScopeObject[]>(
          `${await this.adminRestClient.getResourceServerBaseUrl('policy')}/${id}/scopes`
        ),
    ]);

    return {
      ...permission.data,
      resources: resources.data.map((r) => r._id),
      policies: associatedPolicies.data.map((p) => p.id),
      scopes: scopes.data.map((s) => s.id),
    };
  }

  /**
   * Creates a new permission
   *
   * @param {PermissionCreatePayload} createPayload - Datas of permission to create
   * @returns {KeycloakPermissionObject}
   */
  async create(createPayload: PermissionCreatePayload): Promise<KeycloakPermissionObject> {
    const createPermissionResult = await this.adminRestClient
      .getClient()
      .post<KeycloakPermissionObject>(
        await this.adminRestClient.getResourceServerBaseUrl('permission/scope'),
        createPayload
      );

    if (!createPermissionResult?.data) {
      throw new EmptyRestResponse('permissions.create');
    }

    return createPermissionResult.data;
  }

  /**
   * Update a permission by its id
   *
   * @param {string} permissionId - id of permission to update
   * @param {KeycloakPermissionObject} updatePayload - the full permission object datas
   * @returns {boolean}
   */
  async update(permissionId: string, updatePayload: KeycloakPermissionObject): Promise<boolean> {
    await this.adminRestClient
      .getClient()
      .put<KeycloakPermissionObject>(
        await this.adminRestClient.getResourceServerBaseUrl(`permission/scope/${permissionId}`),
        updatePayload
      );

    return true;
  }

  /**
   * Delete a permission by its id
   * @param {string} permissionId - the id of the permission
   * @returns {boolean}
   */
  async delete(permissionId: string): Promise<boolean> {
    await this.adminRestClient
      .getClient()
      .delete(
        await this.adminRestClient.getResourceServerBaseUrl(`permission/scope/${permissionId}`)
      );

    return true;
  }

  /**
   * Find unique permission by its name - throws an error if multiple permissions
   * @param {string} name - the name of the permission
   * @returns {KeycloakPartialPermissionObject | null}
   * @throws {AdminRestClientError}
   */
  async findUniquePermissionByName(name: string): Promise<KeycloakPartialPermissionObject | null> {
    let permissions = await this.list({
      first: 0,
      max: 1000,
      name,
    });

    if (permissions?.length > 1) {
      throw new AdminRestClientError(
        `permissions.findUniquePermissionByName: Multiple permissions found for name : ${name}`
      );
    }

    return permissions?.[0] ?? null;
  }

  /**
   * Find a permission. If it does not exists, create it
   * @param {FindOrCreatePermissionArgs} FindOrCreatePermissionArgs - payload to filter or create the permission
   * @returns {boolean}
   */
  async findOrCreatePermission({
    name,
    policiesIds,
    scopes,
    projectId,
  }: FindOrCreatePermissionArgs): Promise<boolean> {
    const permission = await this.findUniquePermissionByName(name);

    if (!permission) {
      const newPermission = await this.create({
        name,
        scopes,
        policies: policiesIds,
        resources: [projectId],
        decisionStrategy: KeycloakDecisionStrategyType.UNANIMOUS,
      });

      return Boolean(newPermission);
    }

    const fullPermissionObject = await this.get(permission.id);
    if (!fullPermissionObject) {
      throw new AdminRestClientError(
        `permissions.findOrCreatePermission : Could not find permission with id ${permission.id}`
      );
    }

    const updatedPermissionResult = await this.update(permission.id, {
      ...fullPermissionObject,
      scopes,
      policies: policiesIds,
      // we want to add the project but not overwrite current resources
      resources: [...(fullPermissionObject.resources || []), projectId],
    });

    return updatedPermissionResult;
  }
}
