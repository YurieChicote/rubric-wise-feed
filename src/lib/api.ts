export function apiUrl(path: string) {
  if (typeof window === "undefined") return path;
  const isLocalApi = ["localhost", "127.0.0.1"].includes(window.location.hostname) && window.location.port !== "4000";
  const isStaticPreview = window.location.pathname.startsWith("/rubric-wise-feed/dist");
  return isLocalApi || isStaticPreview ? `http://127.0.0.1:4000${path}` : path;
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "The request could not be completed.");
  return result as T;
}
