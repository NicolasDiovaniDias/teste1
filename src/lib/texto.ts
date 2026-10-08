/** Remove acentos e deixa minúsculo: "São José" -> "sao jose" */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** Cria um identificador para a URL: "Jardim das Flores" -> "jardim-das-flores" */
export function criarSlug(texto: string): string {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
