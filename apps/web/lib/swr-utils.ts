export class FetchError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
  }
}

export const swrFetchHandler =
  (setRequestInit: (args: any[]) => RequestInit = (_: any[]) => ({})) =>
  async (...args: any[]) => {
    const fetchResults = await fetch(args[0], setRequestInit(args)).then(
      (res) => res.json()
    );

    if (fetchResults?.error) {
      throw new FetchError(fetchResults.error, fetchResults?.errorStatus);
    }

    return fetchResults;
  };
