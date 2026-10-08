import { hojeISO } from '@/lib/datas'
import type { Noticia, SituacaoNoticia } from '@/types/noticia'

export function situacao(noticia: Noticia, hoje: string = hojeISO()): SituacaoNoticia {
  if (!noticia.publicada) return 'rascunho'
  // Datas no formato AAAA-MM-DD podem ser comparadas como texto
  return noticia.publicadaEm > hoje ? 'agendada' : 'publicada'
}

/** A notícia aparece no site? (publicada e com data de hoje ou anterior) */
export function estaNoAr(noticia: Noticia): boolean {
  return situacao(noticia) === 'publicada'
}

/** Divide o texto em parágrafos (separados por uma linha em branco) */
export function paragrafos(texto: string): string[] {
  return texto
    .split(/\n\s*\n/)
    .map((paragrafo) => paragrafo.trim())
    .filter(Boolean)
}

/** Mais recentes primeiro (no mesmo dia, a editada por último vem antes) */
export function ordenarNoticias(noticias: Noticia[]): Noticia[] {
  return [...noticias].sort(
    (a, b) => b.publicadaEm.localeCompare(a.publicadaEm) || b.atualizadoEm.localeCompare(a.atualizadoEm),
  )
}
