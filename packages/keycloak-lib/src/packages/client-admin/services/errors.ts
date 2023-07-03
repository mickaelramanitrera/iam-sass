import { AdminRestClientError } from '../../errors';

export class ListScopesError extends AdminRestClientError {
  constructor(public readonly client: string, public readonly reason?: string) {
    super(`listScopes errored : ${reason}`);
  }
}

export class CreateScopeError extends AdminRestClientError {
  constructor(
    public readonly client: string,
    public readonly payload: any,
    public readonly reason?: string
  ) {
    super(`createScope errored : ${reason}`);
  }
}

export class DeleteScopeError extends AdminRestClientError {
  constructor(
    public readonly client: string,
    public readonly scopeId: string,
    public readonly reason?: string
  ) {
    super(`deleteScope errored : ${reason}`);
  }
}

export class ClientNotFoundError extends AdminRestClientError {
  constructor(public readonly clientName: string) {
    super(`client ${clientName} not found`);
  }
}

export class UserDoesNotExistsError extends AdminRestClientError {
  constructor(public readonly userId: string) {
    super(`User does not exists`);
  }
}

export class RoleNotProvideError extends AdminRestClientError {
  constructor(public readonly username?: string) {
    super(`Fail to assign user role : role is not provide : username:[${username}]`);
  }
}

export class HubClientNotFound extends AdminRestClientError {
  constructor(public readonly scope: string) {
    super(`${scope} : Hub client was not found`);
  }
}

export class EmptyRestResponse extends AdminRestClientError {
  constructor(public readonly scope: string) {
    super(`${scope} : rest did not return any data`);
  }
}

export class ResourceNotFoundError extends AdminRestClientError {
  constructor(public readonly scope: string, public readonly resourceName: string) {
    super(`${scope} : resource not found`);
  }
}

export class AddProjectToOrgError extends AdminRestClientError {
  constructor(
    public readonly message: string,
    public readonly projectId: string,
    public readonly groupId: string,
    public readonly role: string
  ) {
    super(`organizations.addProject : ${message}`);
  }
}
