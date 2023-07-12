export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type KeycloakResourceObject = {
  _id: string;
  name: string;
  type: string;
  resource_scopes: string[];
  attributes?: Record<string, any>;
};

export type KeycloakResourcePayload = Omit<KeycloakResourceObject, "_id">;

export type KeycloakScopeObject = {
  id: string;
  name: string;
  iconUri: string;
  displayName: string;
};

export type KeycloakScopePayload = AtLeast<KeycloakScopeObject, "name">;

export type KeycloakOrganizationObject = {
  id: string;
  name: string;
  attributes?: Record<string, string>;
  path: string;
  description?: string;
};

export type KeycloakOrganizationPayload = AtLeast<
  KeycloakOrganizationObject,
  "name"
>;

export type KeycloakUserObject = {
  id: string;
  attributes?: Record<string, string>;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
};

export type KeycloakRoleObject = {
  id: string;
  name: string;
  description?: string;
  composite?: boolean;
  clientRole?: boolean;
  containerId?: boolean;
};

export type KeycloakUserCreationPayload = {
  email: string;
  password: string;
  role?: KeycloakRolePayload;
  enabled?: boolean;
};

export type KeycloakUserUpdatePayload = Pick<
  KeycloakUserCreationPayload,
  "enabled"
>;

export type KeycloakRolePayload = Pick<KeycloakRoleObject, "id" | "name">;

export enum KeycloakLogicType {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
}

export enum KeycloakPolicyType {
  GROUP = "group",
  ROLE = "role",
}

export enum KeycloakDecisionStrategyType {
  UNANIMOUS = "UNANIMOUS",
  CONSENSUS = "CONSENSUS",
  AFFIRMATIVE = "AFFIRMATIVE",
}

export type KeycloakBasePolicyObject = {
  decisionStrategy: KeycloakDecisionStrategyType;
  description: string;
  id: string;
  logic: KeycloakLogicType;
  name: string;
  type: KeycloakPolicyType;
};

export type KeycloakGroupPolicyObject = {
  groups: { id: string; extendChildren: boolean }[];
  groupsClaim?: string;
} & KeycloakBasePolicyObject;

export type KeycloakRolePolicyObject = {
  roles: { id: string; required: boolean }[];
} & KeycloakBasePolicyObject;

export type KeycloakPartialPermissionObject = {
  id: string;
  name: string;
  logic: KeycloakLogicType;
  decisionStrategy: KeycloakDecisionStrategyType;
  description?: string;
  type: string;
};

export type KeycloakPermissionObject = KeycloakPartialPermissionObject & {
  policies?: string[];
  resources?: string[];
  scopes?: string[];
};
