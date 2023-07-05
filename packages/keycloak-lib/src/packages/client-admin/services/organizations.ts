import AuthenticatedService from "./authenticatedService";
import {
  KeycloakOrganizationObject,
  KeycloakOrganizationPayload,
  KeycloakUserObject,
} from "../../types";
import { AddProjectToOrgError, UserDoesNotExistsError } from "./errors";
import { AdminRestClientError } from "../../errors";
import { PermissionNaming } from "../naming";

export type ListFilters = { search?: string; first?: number; max?: number };

type ListMembersFilters = {
  briefRepresentation?: boolean;
  first?: number;
  max?: number;
};

type AddProjectPermissionArgs = {
  projectId: string;
  groupId: string;
  role: string;
  scopeNames: string[];
};

type RemoveProjectPermissionArgs = {
  projectId: string;
  groupId: string;
  roleName: string;
};

export default class Organizations extends AuthenticatedService {
  /**
   * Create a new organization (group)
   * @param {KeycloakOrganizationPayload} organizationPayload - the organization we want to create
   * @returns {boolean} - true for all status code below 400. There is no data returned by the api for this
   */
  async create(
    organizationPayload: KeycloakOrganizationPayload
  ): Promise<boolean> {
    const organizationResponse = await this.adminRestClient
      .getClient()
      .post<KeycloakOrganizationObject>("groups", organizationPayload);

    return organizationResponse.status < 400;
  }

  /**
   * List all organizations based on filters
   * @param {ListFilters} filters - Filters to apply to the list
   * @returns {KeycloakOrganizationObject[]}
   */
  async list(filters?: ListFilters): Promise<KeycloakOrganizationObject[]> {
    const organizationResponse = await this.adminRestClient
      .getClient()
      .get<KeycloakOrganizationObject[]>("groups", {
        params: filters || {},
      });

    if (!organizationResponse.data) {
      console.warn("organizations.list : rest did not return any data");
      return [];
    }

    return organizationResponse.data;
  }

  /**
   * add a new member to the organization
   * returns false if user is already member of the org
   *
   * @param {string} userId
   * @param {string} groupId
   * @returns {boolean}
   */
  async addMember(userId: string, groupId: string): Promise<boolean> {
    const user = await this.adminRestClient.users.get(userId);
    if (!user) {
      throw new UserDoesNotExistsError(userId);
    }

    const usersOrganizations = (
      await this.listUserMemberships(userId, { first: 0, max: 1000 })
    ).map((org) => org.id);

    // user already member of that organization
    if (usersOrganizations.includes(groupId)) {
      return false;
    }

    await this.adminRestClient
      .getClient()
      .put(`users/${userId}/groups/${groupId}`);

    return true;
  }

  /**
   * Remove an organization member
   * returns false if the user was not a member
   *
   * @param {string} userId
   * @param {string} groupId
   * @returns {boolean}
   */
  async removeMember(userId: string, groupId: string): Promise<boolean> {
    const user = await this.adminRestClient.users.get(userId);
    if (!user) {
      throw new UserDoesNotExistsError(userId);
    }

    const usersOrganizations = (
      await this.listUserMemberships(userId, { first: 0, max: 1000 })
    ).map((org) => org.id);

    // user is not in the organization anymore
    if (!usersOrganizations.includes(groupId)) {
      return false;
    }

    await this.adminRestClient
      .getClient()
      .delete(`users/${userId}/groups/${groupId}`);

    return true;
  }

  /**
   * List users that are members of this organization
   * @param {string} groupId id - id of the organization (group)
   * @param {ListMemberFilters} filters - filters to apply, with pagination
   * @returns {KeycloakUserObject[]}
   */
  async listMembers(
    groupId: string,
    filters?: ListMembersFilters
  ): Promise<KeycloakUserObject[]> {
    const membersResponse = await this.adminRestClient
      .getClient()
      .get<KeycloakUserObject[]>(`groups/${groupId}/members`, {
        params: filters || {},
      });

    return membersResponse.data;
  }

  /**
   * List all organizations that have this user as a member
   * @param {string} userId - id of the user
   * @param {ListFilters} paginationOpts - result pagination option
   * @returns KeycloakOrganizationObject[]
   */
  async listUserMemberships(
    userId: string,
    paginationOpts?: Omit<ListFilters, "search">
  ) {
    const membershipsResponse = await this.adminRestClient
      .getClient()
      .get<Omit<KeycloakOrganizationObject, "attributes">[]>(
        `users/${userId}/groups`,
        {
          params: paginationOpts || {},
        }
      );

    return membershipsResponse.data;
  }

  /**
   * Add a permission for members of this org with this role
   * to access a specific project
   * @param {AddProjectPermissionArgs} projectPermissionArgs
   * @returns {boolean}
   */
  async addProjectPermissionForRole({
    projectId,
    scopeNames,
    groupId,
    role,
  }: AddProjectPermissionArgs): Promise<boolean> {
    const scopesIds = await this.transformScopeNamesToScopeIds(scopeNames);

    const organizationPolicy =
      await this.adminRestClient.policies.findOrCreateOrganizationPolicy(
        groupId
      );
    if (!organizationPolicy) {
      throw new AddProjectToOrgError(
        "could not find nor create organization authorize policy",
        projectId,
        groupId,
        role
      );
    }

    const rolePolicy =
      await this.adminRestClient.policies.findOrCreateRolePolicy(role);
    if (!rolePolicy) {
      throw new AddProjectToOrgError(
        "could not find nor create role policy",
        projectId,
        groupId,
        role
      );
    }

    const organizationPermission =
      await this.adminRestClient.permissions.findOrCreatePermission({
        name: PermissionNaming.getNameForOrgWithRole(groupId, role),
        policiesIds: [rolePolicy.id, organizationPolicy.id],
        scopes: scopesIds,
        projectId,
      });

    if (!organizationPermission) {
      throw new AddProjectToOrgError(
        "No permissions were created",
        projectId,
        groupId,
        role
      );
    }

    return true;
  }

  /**
   * Remove permission for members of this org with this role
   * to access a specific project
   * @param {RemoveProjectPermissionArgs} projectPermissionArgs
   * @returns {boolean}
   */
  async removeProjectPermissionForRole({
    projectId,
    roleName,
    groupId,
  }: RemoveProjectPermissionArgs): Promise<boolean> {
    // Ensure the role passed exists in Keycloak
    let matchingRole = await this.adminRestClient.roles.list({
      first: 0,
      max: 1000,
      search: roleName,
    });
    if (!matchingRole?.length) {
      throw new AdminRestClientError(
        `organizations.removeProjectForRole: Could not find role with name ${roleName}`
      );
    }

    // Get the unique permission by the naming convention
    // this will throw an error if it find more than one permission
    // multiple permission with same name must not exist
    const permission =
      await this.adminRestClient.permissions.findUniquePermissionByName(
        PermissionNaming.getNameForOrgWithRole(groupId, roleName)
      );

    // if the permission doesn't exists anymore, we don't need to do anything
    if (!permission) {
      console.warn(
        `No permission found for project ${projectId} groupId ${groupId} role ${roleName}. Skipping removal`
      );
      return false;
    }

    // Get the full permission object to get access to scopes, resources, and policies
    const fullPermissionObject = await this.adminRestClient.permissions.get(
      permission.id
    );
    if (!fullPermissionObject) {
      throw new AdminRestClientError(
        `organizations.removeProjectForRole: Could not find full permission object for ${permission.id}`
      );
    }

    if (!fullPermissionObject.resources?.length) {
      throw new AdminRestClientError(
        `organizations.removeProjectForRole: permission object has no resources`
      );
    }

    const onlyResourceToRemoveLeft =
      fullPermissionObject.resources.includes(projectId) &&
      fullPermissionObject.resources.length === 1;

    if (onlyResourceToRemoveLeft) {
      // if there is only the resource to remove left on the permission, we delete the permission
      // because we cannot have a permission with empty resources
      await this.adminRestClient.permissions.delete(fullPermissionObject.id);
      return true;
    }

    // we just update the permission by removing the resource
    // and leave everything else
    const newResources = fullPermissionObject.resources.filter(
      (resourceId) => resourceId !== projectId
    );
    await this.adminRestClient.permissions.update(fullPermissionObject.id, {
      // the payload need to repass the full object even if we just change a field
      // otherwise it errors
      ...fullPermissionObject,
      resources: newResources,
    });

    return true;
  }

  private async transformScopeNamesToScopeIds(scopeNames: string[]) {
    const allScopes = await this.adminRestClient.scopes.list("any");
    if (!allScopes?.length) {
      throw new AdminRestClientError(
        `organizations.addProject.transformScopeNamesToScopeIds: no scopes found for client`
      );
    }
    const allScopesNames = allScopes.map((scope) => scope.name);

    if (!scopeNames.every((scopeName) => allScopesNames.includes(scopeName))) {
      throw new AdminRestClientError(
        "organizations.addProject.transformScopeNamesToScopeIds: Some scopes are missing. They need to be resynced"
      );
    }

    return allScopes
      .filter((scope) => scopeNames.includes(scope.name))
      .map((scope) => scope.id);
  }
}
