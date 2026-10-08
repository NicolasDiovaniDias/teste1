import { NOTICIAS_EXEMPLO } from '@/data/noticiasExemplo'
import type { Noticia } from '@/types/noticia'
import { apagarDoNavegador, esperar, gravarNoNavegador, lerDoNavegador } from './armazenamento'

/*
 * "API" das notícias. Mesma ideia de bairrosApi.ts: hoje salva no navegador.
 * Com backend, troque o corpo de cada função por um fetch, por exemplo:
 *   GET    /noticias       -> listarNoticias
 *   PUT    /noticias/:id   -> salvarNoticia
 *   DELETE /noticias/:id   -> excluirNoticia
 */
const CHAVE = 'coleta-seletiva:noticias'
const ler = () => lerDoNavegador<Noticia[]>(CHAVE, () => structuredClone(NOTICIAS_EXEMPLO))

export async function listarNoticias(): Promise<Noticia[]> {
  await esperar(250)
  return ler()
}

export async function salvarNoticia(noticia: Noticia): Promise<Noticia> {
  await esperar(300)
  const noticias = ler()
  const salva: Noticia = { ...noticia, atualizadoEm: new Date().toISOString() }
  const indice = noticias.findIndex((n) => n.id === noticia.id)
  if (indice === -1) noticias.push(salva)
  else noticias[indice] = salva
  gravarNoNavegador(CHAVE, noticias)
  return salva
}

export async function excluirNoticia(id: string): Promise<void> {
  await esperar(300)
  gravarNoNavegador(
    CHAVE,
    ler().filter((n) => n.id !== id),
  )
}

/** Apaga as alterações feitas no navegador e volta para as notícias de exemplo. */
export async function restaurarExemplo(): Promise<Noticia[]> {
  apagarDoNavegador(CHAVE)
  return listarNoticias()
}
