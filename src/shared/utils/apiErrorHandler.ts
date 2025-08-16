export interface ApiError {
  message: string;
  code?: string | number;
  isNetworkError: boolean;
  isServerError: boolean;
  isClientError: boolean;
}

export function parseApiError(error: Error | unknown): ApiError {
  if (error instanceof Error) {
    const message = error.message;

    if (message.includes("fetch") || message.includes("network")) {
      return {
        message:
          "Network error. Please check your internet connection and try again.",
        code: "NETWORK_ERROR",
        isNetworkError: true,
        isServerError: false,
        isClientError: false,
      };
    }

    if (message.includes("timeout")) {
      return {
        message: "Request timed out. Please try again.",
        code: "TIMEOUT_ERROR",
        isNetworkError: true,
        isServerError: false,
        isClientError: false,
      };
    }

    if (message.includes("500") || message.includes("server")) {
      return {
        message: "Server error. Please try again later.",
        code: "SERVER_ERROR",
        isNetworkError: false,
        isServerError: true,
        isClientError: false,
      };
    }

    if (message.includes("404")) {
      return {
        message: "Resource not found.",
        code: 404,
        isNetworkError: false,
        isServerError: false,
        isClientError: true,
      };
    }

    if (message.includes("401")) {
      return {
        message: "Unauthorized access.",
        code: 401,
        isNetworkError: false,
        isServerError: false,
        isClientError: true,
      };
    }

    if (message.includes("403")) {
      return {
        message: "Access forbidden.",
        code: 403,
        isNetworkError: false,
        isServerError: false,
        isClientError: true,
      };
    }

    return {
      message: error.message || "An unexpected error occurred.",
      code: "UNKNOWN_ERROR",
      isNetworkError: false,
      isServerError: false,
      isClientError: true,
    };
  }

  return {
    message: "An unexpected error occurred. Please try again.",
    code: "UNKNOWN_ERROR",
    isNetworkError: false,
    isServerError: false,
    isClientError: true,
  };
}

export function getRetryDelay(attemptNumber: number): number {
  return Math.min(1000 * Math.pow(2, attemptNumber), 30000);
}

export function shouldRetry(
  error: Error | unknown,
  attemptNumber: number
): boolean {
  const maxRetries = 3;

  if (attemptNumber >= maxRetries) {
    return false;
  }

  const parsedError = parseApiError(error);

  return parsedError.isNetworkError || parsedError.isServerError;
}
