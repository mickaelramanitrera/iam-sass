import OIDCClient from './packages/client';
import AdminClient from './packages/client-admin';

export { PermissionNaming, PolicyNaming } from './packages/client-admin/naming';

export type {
  KeycloakScopePayload,
  KeycloakScopeObject,
  KeycloakResourceObject,
  KeycloakResourcePayload,
  KeycloakOrganizationObject,
  KeycloakUserObject,
  KeycloakUserCreationPayload,
  KeycloakUserUpdatePayload,
  KeycloakRoleObject,
  KeycloakRolePayload,
} from './packages/types';
export { OIDCClient, AdminClient };
