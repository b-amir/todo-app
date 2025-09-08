import ApiError from "./ApiError";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export function getMethod(options?: RequestInit): HttpMethod {
  return (options?.method || "GET").toUpperCase() as HttpMethod;
}

export function shouldRetry(status: number): boolean {
  return (status >= 500 && status < 600) || status === 429;
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createTimeoutSignal(
  timeoutMs: number,
  external?: AbortSignal | null
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (external) {
    if (external.aborted) controller.abort();
    else
      external.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
  }
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

export async function fetchOnce(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const { signal, clear } = createTimeoutSignal(
    timeoutMs,
    init.signal ?? undefined
  );
  try {
    return await fetch(url, { ...init, signal });
  } catch (e) {
    const isAbort = (e as any)?.name === "AbortError";
    if (isAbort) throw new ApiError("Request timed out", 408);
    throw new ApiError((e as Error)?.message || "Network error", 0);
  } finally {
    clear();
  }
}

export async function parseJson<T>(response: Response): Promise<T | undefined> {
  try {
    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}

export async function toApiError(response: Response): Promise<ApiError> {
  const data = await parseJson<any>(response);
  const message =
    (data && (data.message || data.error)) || `HTTP ${response.status}`;
  return new ApiError(message, response.status);
}
