import type { Bairro } from '@/types/coleta'
import { api } from './http'

export function listarBairros(): Promise<Bairro[]> {
  return api<Bairro[]>('/bairros')
}

/** Cria ou atualiza (o servidor substitui os turnos pelos enviados). */
export function salvarBairro(bairro: Bairro): Promise<Bairro> {
  return api<Bairro>(`/bairros/${encodeURIComponent(bairro.id)}`, { method: 'PUT', json: bairro })
}

export function excluirBairro(id: string): Promise<void> {
  return api<void>(`/bairros/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
