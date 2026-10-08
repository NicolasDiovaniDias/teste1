export interface Noticia {
  /** Identificador usado na URL, ex.: "como-separar-o-lixo-reciclavel-em-casa" */
  id: string
  titulo: string
  /** Frase curta que aparece nos cards e no topo da notícia */
  resumo: string
  /** Texto completo. Uma linha em branco separa os parágrafos. */
  conteudo: string
  /** Endereço da imagem de capa (na demonstração, a própria imagem salva como texto) */
  imagem?: string
  /** Descrição da imagem para quem usa leitor de tela */
  imagemDescricao?: string
  /** Data de publicação no formato AAAA-MM-DD */
  publicadaEm: string
  /** false = rascunho: fica só no painel */
  publicada: boolean
  /** Data da última alteração (ISO 8601) */
  atualizadoEm: string
}

/** publicada = no ar; agendada = publicada com data futura; rascunho = só no painel */
export type SituacaoNoticia = 'publicada' | 'agendada' | 'rascunho'
