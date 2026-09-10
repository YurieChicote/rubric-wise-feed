export function apiUrl(path: string) {
  const isStaticPreview = window.location.pathname.startsWith("/rubric-wise-feed/dist");
  return isStaticPreview ? `http://127.0.0.1:4000${path}` : path;
}
