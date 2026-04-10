export function buildImageUrl(path?: string | null) {
  if (!path) return "";

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  const origin = apiBase
    .replace(/\/$/, "");

  const relativePath = path
    .replace(/^\/+/, "")
    .replace(/^uploads\/?/, "");

  return `${origin}/files/${relativePath}`;
}