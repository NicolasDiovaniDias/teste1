import { BAIRROS_EXEMPLO } from '@/data/bairrosExemplo'
import type { Bairro } from '@/types/coleta'
import { apagarDoNavegador, esperar, gravarNoNavegador, lerDoNavegador } from './armazenamento'

/*
 * "API" dos bairros.
 *
 * Por enquanto os dados ficam salvos no navegador (localStorage), para você
 * testar o painel sem backend. Quando a API real existir, troque o corpo de
 * cada função por um fetch: o resto do site (stores e telas) não muda.
 *
 * Exemplo com backend:
 *   const resposta = await fetch(`${import.meta.env.VITE_API_URL}/bairros`)
 *   if (!resposta.ok) throw new Error('Não foi possível carregar os bairros.')
 *   return resposta.json()
 */
const CHAVE = 'coleta-seletiva:bairros'
const ler = () => lerDoNavegador<Bairro[]>(CHAVE, () => structuredClone(BAIRROS_EXEMPLO))

export async function listarBairros(): Promise<Bairro[]> {
  await esperar(250)
  return ler()
}

export async function salvarBairro(bairro: Bairro): Promise<Bairro> {
  await esperar(300)
  const bairros = ler()
  const salvo: Bairro = { ...bairro, atualizadoEm: new Date().toISOString() }
  const indice = bairros.findIndex((b) => b.id === bairro.id)
  if (indice === -1) bairros.push(salvo)
  else bairros[indice] = salvo
  gravarNoNavegador(CHAVE, bairros)
  return salvo
}

export async function excluirBairro(id: string): Promise<void> {
  await esperar(300)
  gravarNoNavegador(
    CHAVE,
    ler().filter((b) => b.id !== id),
  )
}

/** Apaga as alterações feitas no navegador e volta para os bairros de exemplo. */
export async function restaurarExemplo(): Promise<Bairro[]> {
  apagarDoNavegador(CHAVE)
  return listarBairros()
}
