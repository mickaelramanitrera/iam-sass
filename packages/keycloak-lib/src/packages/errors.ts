import { AxiosError } from 'axios';
import { AtLeast } from './types';

export class AdminRestClientError extends Error {
  constructor(message: string, originalError?: any) {
    super(`[KeycloakClient - AdminRestClientError] : ${message}`, { cause: originalError });
  }
}

export class OIDCClientError extends Error {
  constructor(message: string, originalError?: any) {
    super(`[KeycloakClient - OIDCClientError] : ${message}`, { cause: originalError });
  }
}

/**
 * Remove all sensitive informations in axios error
 */
export const sanitizeAxiosError = ({ cause, config, message, stack, status }: AxiosError) => {
  const safeAxiosError: AtLeast<AxiosError, 'message'> = {
    cause,
    config,
    stack,
    status,
    message: message ?? 'Unknown Error',
  };

  if (safeAxiosError?.config?.headers?.Authorization) {
    safeAxiosError.config.headers.Authorization = '';
  }

  if (safeAxiosError?.config?.data) {
    safeAxiosError.config.data = '';
  }

  return safeAxiosError;
};
