import {
  fetchOnce,
  getMethod,
  parseJson,
  shouldRetry,
  toApiError,
  wait,
} from "./httpUtils";

const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_URL || "https://dummyjson.com";

interface ApiClientOptions extends RequestInit {
  timeoutMs?: number;
  maxRetries?: number;
  retryBaseDelayMs?: number;
}

async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint}`;
  const method = getMethod(options);
  const isGet = method === "GET";
  const timeoutMs = options.timeoutMs ?? 10000;
  const maxRetries = isGet ? options.maxRetries ?? 2 : 0;
  const baseDelay = options.retryBaseDelayMs ?? 300;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const send = async (attempt: number): Promise<T> => {
    const response = await fetchOnce(
      url,
      { ...options, method, headers },
      timeoutMs
    );
    if (response.ok) {
      const data = await parseJson<T>(response);
      return data as T;
    }
    if (attempt < maxRetries && shouldRetry(response.status)) {
      await wait(baseDelay * Math.pow(2, attempt));
      return send(attempt + 1);
    }
    throw await toApiError(response);
  };

  return send(0);
}

export default apiClient;
