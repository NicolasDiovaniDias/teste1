import type { Noticia } from '@/types/noticia'
import { api } from './http'

/** Só as notícias que estão no ar (site público) */
export function listarNoticiasPublicadas(): Promise<Noticia[]> {
  return api<Noticia[]>('/noticias')
}

/** Todas, inclusive rascunhos e agendadas (precisa estar logado) */
export function listarTodasNoticias(): Promise<Noticia[]> {
  return api<Noticia[]>('/painel/noticias')
}

/** Cria ou atualiza */
export function salvarNoticia(noticia: Noticia): Promise<Noticia> {
  return api<Noticia>(`/noticias/${encodeURIComponent(noticia.id)}`, { method: 'PUT', json: noticia })
}

export function excluirNoticia(id: string): Promise<void> {
  return api<void>(`/noticias/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
