const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/api"
    : "https://web-engineering-karteikarten.vercel.app/api";

export const request = async <T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = 10000,
): Promise<T> => {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!res.ok) {
      let errorDetail = await res.text();
      try {
        errorDetail = JSON.stringify(await res.json());
      } catch {
        // Ignore JSON parsing error, use text response
      }
      throw new Error(`HTTP ${res.status}: ${errorDetail || res.statusText}`);
    }

    if (res.status === 204) return null as T;

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    }
    // fallback for other types
    return (await res.text()) as unknown as T;
  } finally {
    clearTimeout(id);
  }
};
