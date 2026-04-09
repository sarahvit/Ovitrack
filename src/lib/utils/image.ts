export function buildImageUrl(path?: string | null) {
  if (!path) return "";

  const apiBase = process.env.NEXT_PUBLIC_API_URL|| "";  // Pega a URL base da API

  // Usa diretamente a baseURL e o caminho, sem remover barras
  return `${apiBase}/${path}`;
}