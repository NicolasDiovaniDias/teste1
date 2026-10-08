import type { RespostaCep, RespostaRua } from '@/types/busca'
import { api } from './http'

/** cep: só os 8 números */
export function buscarPorCep(cep: string): Promise<RespostaCep> {
  return api<RespostaCep>(`/busca/cep/${cep}`)
}

export function buscarPorRua(texto: string): Promise<RespostaRua> {
  return api<RespostaRua>(`/busca/rua?q=${encodeURIComponent(texto)}`)
}
