const API_BASE_URL = "https://dummyjson.com";

export class ApiError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Ignore if response is not json
    }
    throw new ApiError(errorMessage, response.status);
  }

  return response.json();
}

export default apiClient;
