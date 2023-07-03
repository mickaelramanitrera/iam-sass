import { AdminRestClientError } from '../../errors';
import type AdminRestClient from '../index';

/**
 * Returns a proxy for any subclass which will call `ensureAuthenticated`
 * for all method calls before actually executing them
 */
export default abstract class AuthenticatedService {
  // We ignore ensureAuthenticated so that we don't end up endlessly looping in the proxy
  private static ignoredProxiedMethods: (string | Symbol)[] = ['ensureAuthenticated'];

  constructor(protected adminRestClient: AdminRestClient) {
    return new Proxy(this, {
      // Trap all access to any property (including methods as they are just properties as functions)
      get(getTarget, getProp) {
        if (
          // don't trap methods that should be ignored
          AuthenticatedService.ignoredProxiedMethods.includes(getProp) ||
          // don't trap property accessors
          typeof (getTarget as any)[getProp] !== 'function'
        ) {
          // We just call the original method/property
          return Reflect.get(getTarget, getProp);
        }

        // Create a new proxy to trap all calls to the method
        return new Proxy((getTarget as any)[getProp], {
          async apply(applyTarget, thisArg, argsList) {
            // call ensureAuthenticated before all calls on any method
            await AuthenticatedService.ensureAuthenticated(getTarget.adminRestClient);

            // Call the normal method now
            return Reflect.apply(applyTarget, thisArg, argsList);
          },
        });
      },
    });
  }

  static async ensureAuthenticated(adminRestClient: AdminRestClient) {
    const isAuthenticated = await adminRestClient.authenticate();
    if (!isAuthenticated) {
      throw new AdminRestClientError('AdminRestClient is not authenticated');
    }
  }
}
