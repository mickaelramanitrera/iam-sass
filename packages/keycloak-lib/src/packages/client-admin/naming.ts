export const ORG_PREFIX = 'org:';
export const ROLE_POLICY_PREFIX = 'has_role_';

export class PermissionNaming {
  static getNameForOrg(orgId: string) {
    return `${ORG_PREFIX}${orgId}`;
  }

  static getNameForOrgWithRole(orgId: string, role: string) {
    return `${PermissionNaming.getNameForOrg(orgId)}:role:${role.toUpperCase()}`;
  }

  /**
   * Get a regex pattern that makes it possible to
   * extract the organization ID from a permission name.
   * For Reference, see: https://bloomsocialanalytics.atlassian.net/wiki/spaces/PB/pages/2297561123/IAM+Keycloak+authz+conventions
   *
   * Permission are named "org:<ORG_ID>:role:<ROLE_NAME> so for example
   * org:08ff-7b6-a8c:role:ADMIN will get extracted the id : 08ff-7b6-a8c
   */
  static getOrgIdParseRegex() {
    return new RegExp(/org\:([0-9a-f\-]*)\:/i);
  }
}

export class PolicyNaming {
  static getNameForRolePolicy(role: string) {
    return `${ROLE_POLICY_PREFIX}${role.toLowerCase()}`;
  }

  static getNameForOrgPolicy(orgId: string) {
    return `${ORG_PREFIX}${orgId}:authorize`;
  }
}
