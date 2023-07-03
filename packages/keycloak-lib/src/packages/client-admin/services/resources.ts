import AuthenticatedService from './authenticatedService';
import type AdminRestClient from '..';
import type {
  KeycloakResourcePayload,
  KeycloakPermissionObject,
  KeycloakResourceObject,
} from '../../types';
import { EmptyRestResponse, ResourceNotFoundError } from './errors';
import { ORG_PREFIX, PermissionNaming } from '../naming';

type Filters = {
  type?: string;
  name?: string;
};

type PaginationOptions = {
  first?: number;
  max?: number;
};

type ListAssociatedOrganizationsFilters = {
  scope?: string;
} & PaginationOptions;

type ResourceResults = {
  name: string;
  type: string;
  owner: { id: string; name: string };
  ownerManagedAcess: boolean;
  attributes: Record<string, any>;
  _id: string;
  uris: string[];
  scopes: {
    id: string;
    name: string;
    iconUri: string;
  }[];
};

export default class Resources extends AuthenticatedService {
  private authzResourcesUrl: string;

  constructor(protected adminRestClient: AdminRestClient) {
    super(adminRestClient);
    this.authzResourcesUrl = `${this.adminRestClient.oidcBaseUrl}/authz/protection/resource_set`;
  }

  private filterResources(resources: ResourceResults[], filters?: Filters | undefined) {
    if (!filters) {
      return resources;
    }

    return resources.filter((resource) => {
      const allMatchingFilterKeys = Object.keys(filters || {}).filter(
        (filter) => filter in resource
      );

      return allMatchingFilterKeys.every((filterKey) => {
        return (
          resource[filterKey as keyof ResourceResults] ===
          (filters || {})[filterKey as keyof Filters]
        );
      });
    });
  }

  /**
   * List the resources of the current client by filters
   * @param {Filters} filters
   * @returns {ResourceResults[]}
   */
  async list(filters?: Filters | undefined): Promise<ResourceResults[]> {
    const resources = await this.adminRestClient
      .getClient()
      .get<ResourceResults[]>(this.authzResourcesUrl, {
        params: {
          exactName: true,
          deep: true,
          ...filters,
        },
      });

    if (!resources?.data?.length) {
      return [];
    }

    // redo the filter because it seems like the "exactName" param does not work well
    return this.filterResources(resources.data, filters);
  }

  /**
   * Create a new resource on current client
   * @param {KeycloakResourcePayload} resourcePayload
   * @returns {KeycloakResourceObject}
   */
  async create(resourcePayload: KeycloakResourcePayload): Promise<KeycloakResourceObject> {
    const resource = await this.adminRestClient
      .getClient()
      .post<KeycloakResourceObject>(this.authzResourcesUrl, resourcePayload);

    if (!resource?.data) {
      throw new EmptyRestResponse('resources.create');
    }

    return resource?.data;
  }

  /**
   * Updates a resource by its id
   * @param {string} resourceId
   * @param {Partial<KeycloakResourcePayload>} resourcePayload
   * @returns {boolean}
   */
  async update(
    resourceId: string,
    resourcePayload: Partial<KeycloakResourcePayload>
  ): Promise<boolean> {
    const resource = await this.adminRestClient
      .getClient()
      .put<KeycloakResourceObject>(`${this.authzResourcesUrl}/${resourceId}`, resourcePayload);

    return resource.status < 400;
  }

  /**
   * For a given resource name, find all
   * organizations related to it by finding all
   * permissions including the resource and then filtering the
   * permission name by the pattern org:<orgID>:...
   */
  async listAssociatedOrganizations(
    resourceName: string,
    filters?: ListAssociatedOrganizationsFilters
  ): Promise<string[]> {
    const resource = await this.list({ name: resourceName });
    if (!resource?.length) {
      throw new ResourceNotFoundError('resources.listAssociatedOrganizations', resourceName);
    }

    const { data: associatedPermissions } = await this.adminRestClient
      .getClient()
      .get<KeycloakPermissionObject[]>(
        await this.adminRestClient.getResourceServerBaseUrl(
          `resource/${resource[0]._id}/permissions`
        ),
        {
          params: { ...(filters ?? {}) },
        }
      );

    if (!associatedPermissions?.length) {
      return [];
    }

    const organizationsPermissions =
      associatedPermissions.filter((permission) => permission.name.startsWith(ORG_PREFIX)) || [];

    if (!organizationsPermissions.length) {
      return [];
    }

    // get the organizationId part inside the name of each permission (because permission are named as org:<ORG_ID>:...)
    const organizationsIds = organizationsPermissions
      .map(({ name }) => {
        const orgPatternMatches = name.match(PermissionNaming.getOrgIdParseRegex());

        // there is no pattern that matches the org permission pattern
        if (!orgPatternMatches || orgPatternMatches.length !== 2) {
          return null;
        }

        // return the match inside parenthesis aka organizationId
        return orgPatternMatches[1];
      })
      .filter((orgId): orgId is string => !!orgId);

    // return a dedupe of the organizationIds
    return Array.from(new Set(organizationsIds));
  }
}
