import { AdminRestClientError } from '../../errors';
import {
  KeycloakBasePolicyObject,
  KeycloakGroupPolicyObject,
  KeycloakLogicType,
  KeycloakPolicyType,
  KeycloakRolePolicyObject,
} from '../../types';
import { PolicyNaming } from '../naming';
import AuthenticatedService from './authenticatedService';
import { EmptyRestResponse } from './errors';

type CreateGroupPolicyPayload = Omit<KeycloakGroupPolicyObject, 'id' | 'decisionStrategy' | 'type'>;

type CreateRolePolicyPayload = Omit<KeycloakRolePolicyObject, 'id' | 'decisionStrategy' | 'type'>;

type ListFilters = { first?: number; max?: number; name?: string; type?: string };

export default class Policies extends AuthenticatedService {
  /**
   * Create a policy for giving grants based on groups
   * @param {CreateGroupPolicyPayload} createPayload
   * @returns {KeycloakGroupPolicyObject}
   */
  async createGroupPolicy(
    createPayload: CreateGroupPolicyPayload
  ): Promise<KeycloakGroupPolicyObject> {
    const createResults = await this.adminRestClient
      .getClient()
      .post<KeycloakGroupPolicyObject>(
        await this.adminRestClient.getResourceServerBaseUrl('policy/group'),
        {
          ...createPayload,
          type: KeycloakPolicyType.GROUP,
        }
      );

    if (!createResults?.data) {
      throw new EmptyRestResponse('policies.createGroupPolicy');
    }

    return createResults.data;
  }

  /**
   * Create a policy for giving grants based on role
   * @param {CreateRolePolicyPayload} createPayload
   * @returns {KeycloakRolePolicyObject}
   *
   */
  async createRolePolicy(
    createPayload: CreateRolePolicyPayload
  ): Promise<KeycloakRolePolicyObject> {
    const createResults = await this.adminRestClient
      .getClient()
      .post<KeycloakRolePolicyObject>(
        await this.adminRestClient.getResourceServerBaseUrl('policy/role'),
        {
          ...createPayload,
          type: KeycloakPolicyType.ROLE,
        }
      );

    if (!createResults?.data) {
      throw new EmptyRestResponse('policies.createGroupPolicy');
    }

    return createResults.data;
  }

  /**
   * List policies based on filters
   * @param {ListFilters} filters
   * @returns {KeycloakBasePolicyObject[]}
   */
  async list(filters?: ListFilters): Promise<KeycloakBasePolicyObject[]> {
    const listResults = await this.adminRestClient
      .getClient()
      .get<KeycloakBasePolicyObject[]>(
        await this.adminRestClient.getResourceServerBaseUrl('policy'),
        {
          params: { ...(filters ?? {}) },
        }
      );

    if (!listResults?.data) {
      throw new EmptyRestResponse('policies.list');
    }

    return listResults.data;
  }

  /**
   * Find a role policy by role name.
   * It will find a role policy that matches the role policy naming.
   * If not found, it will create it
   *
   * @param {string} role - the role name
   */
  async findOrCreateRolePolicy(role: string) {
    let matchingRole = await this.adminRestClient.roles.list({ first: 0, max: 1000, search: role });
    if (!matchingRole?.length) {
      throw new AdminRestClientError(
        `policies.findOrCreateRolePolicy: Could not find role with name ${role}`
      );
    }

    const rolePolicyName = PolicyNaming.getNameForRolePolicy(matchingRole[0].name);
    const existingRolePolicy = (
      await this.adminRestClient.policies.list({
        first: 0,
        max: 1000,
        name: rolePolicyName,
        type: KeycloakPolicyType.ROLE,
      })
    ).filter(
      (rolePolicy): rolePolicy is KeycloakRolePolicyObject =>
        rolePolicy.type === KeycloakPolicyType.ROLE
    );

    if (existingRolePolicy?.length > 1) {
      throw new AdminRestClientError(
        `policies.findOrCreateRolePolicy: Found multiple roles with name ${role}`
      );
    }

    if (existingRolePolicy?.length === 1) {
      return existingRolePolicy[0];
    }

    return this.createRolePolicy({
      name: rolePolicyName,
      logic: KeycloakLogicType.POSITIVE,
      description: `Gives a grant for users with role ${role}`,
      roles: [{ id: matchingRole[0].id, required: false }],
    });
  }

  /**
   * Find an organization policy by organization id.
   * It will find an organization policy that matches the organization policy naming
   *
   * @param {string} groupId
   */
  async findOrCreateOrganizationPolicy(groupId: string) {
    const policyName = PolicyNaming.getNameForOrgPolicy(groupId);

    const currentOrganizationAuthorizePolicies = await this.list({
      first: 0,
      max: 1000,
      name: policyName,
      type: KeycloakPolicyType.GROUP,
    });

    if (currentOrganizationAuthorizePolicies?.length === 1) {
      return currentOrganizationAuthorizePolicies[0];
    }

    if (currentOrganizationAuthorizePolicies?.length > 1) {
      throw new AdminRestClientError(
        `policies.findOrCreateOrganizationAuthorizePolicy: Found multiple authorize organization policies for org [${groupId}]`
      );
    }

    return this.createGroupPolicy({
      description: 'Gives a grant when user is member of this organization',
      groups: [{ id: groupId, extendChildren: false }],
      logic: KeycloakLogicType.POSITIVE,
      name: policyName,
    });
  }
}
