export const ApiErrors = {
  NETWORK: {
    type: "network",
    message: "Unable to connect to the server.",
  },
  BAD_REQUEST: {
    type: "http",
    message: "The request was invalid.",
  },
  UNAUTHORIZED: {
    type: "unauthorized",
    message: "You are not authorized.",
  },
  FORBIDDEN: {
    type: "forbidden",
    message: "You don't have permission to perform this action.",
  },
  SERVER_ERROR: {
    type: "server",
    message: "Something went wrong on the server.",
  },
  UNKNOWN: {
    type: "unknown",
    message: "An unexpected error occurred.",
  },
} as const;

export type ApiErrorType = (typeof ApiErrors)[keyof typeof ApiErrors]["type"];

export interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
}

/*

 * API functions can reject with different error shapes.

 * Normalize them so the UI always receives a predictable ApiError.

 */

export function getApiError(error: unknown): ApiError {
  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "message" in error &&
    typeof error.type === "string" &&
    typeof error.message === "string"
  ) {
    const { type, message } = error;

    const statusCode =
      "statusCode" in error && typeof error.statusCode === "number"
        ? error.statusCode
        : undefined;

    return {
      type: type as ApiErrorType,

      message,

      statusCode,
    };
  }

  return { ...ApiErrors.UNKNOWN };
}
