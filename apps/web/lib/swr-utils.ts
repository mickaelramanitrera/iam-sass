import type { MutationFetcher } from "swr/mutation";
import type { Fetcher } from "swr";

export class FetchError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
  }
}

type FetchHandler<TData, TKey extends string, TExtraArgs> =
  | MutationFetcher<TData, TKey, TExtraArgs>
  | Fetcher<TData, string>;

export type FetchResults<T = unknown> = T & {
  error?: string;
  errorStatus?: number;
};

export const swrFetchHandler: <
  TData = unknown,
  TKey extends string = string,
  TExtraArgs = unknown
>(
  setRequestInit?: (args: any[]) => RequestInit
) => FetchHandler<FetchResults<TData>, TKey, TExtraArgs> =
  (setRequestInit = (_: any[]) => ({})) =>
  async <TData>(...args: any[]) => {
    const fetchResults: FetchResults<TData> = await fetch(
      args[0],
      setRequestInit(args)
    ).then((res) => res.json());

    if (fetchResults?.error) {
      throw new FetchError(
        fetchResults.error,
        fetchResults?.errorStatus || 500
      );
    }

    return fetchResults;
  };
