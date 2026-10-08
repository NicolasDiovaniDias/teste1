/** Para comparar nomes: "Sítio São José" e "sitio sao jose" ficam iguais, "RS-040" vira "rs 040" */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Cria um identificador para a URL: "Jardim das Flores" -> "jardim-das-flores" */
export function criarSlug(texto: string): string {
  return normalizar(texto).replace(/ /g, '-')
}
