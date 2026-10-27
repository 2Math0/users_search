import { type ApiError, ApiErrors } from "./apiError";

const BASE_URL = "/api";

/**
 * Sends an HTTP request and returns the parsed response.
 *
 * @param endpoint - The API endpoint relative to the base URL, usage example: `/user`.
 * @param options - Optional Fetch API request configuration.
 * @returns The parsed response is Generic.
 * @throws ApiError when the request fails.
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  /*
   * Development-only testing:
   * Set VITE_API_TEST_ERROR to "network", "400", or "500".
   * This simulates failures without changing production behavior.
   */
  if (import.meta.env.DEV) {
    const testError = import.meta.env.VITE_API_TEST_ERROR;

    if (testError === "network") {
      throw { ...ApiErrors.NETWORK } satisfies ApiError;
    }

    if (testError === "400" || testError === "500") {
      const statusCode = Number(testError);

      const error =
        statusCode === 400 ? ApiErrors.BAD_REQUEST : ApiErrors.SERVER_ERROR;

      throw {
        ...error,
        statusCode,
      } satisfies ApiError;
    }
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, options);
  } catch {
    throw { ...ApiErrors.NETWORK } satisfies ApiError;
  }

  if (!response.ok) {
    let error: ApiError;

    switch (response.status) {
      case 400:
        error = ApiErrors.BAD_REQUEST;
        break;

      case 401:
        error = ApiErrors.UNAUTHORIZED;
        break;

      case 403:
        error = ApiErrors.FORBIDDEN;
        break;

      default:
        error =
          response.status >= 500 ? ApiErrors.SERVER_ERROR : ApiErrors.UNKNOWN;
    }

    throw {
      ...error,
      statusCode: response.status,
    } satisfies ApiError;
  }

  return response.json() as Promise<T>;
}
