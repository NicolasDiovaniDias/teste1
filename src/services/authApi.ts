import { api } from './http'

/*
 * Login do painel. Quem confere e-mail e senha é a API: ela devolve um cookie
 * de sessão (httpOnly, que o JavaScript da página nem consegue ler) e confere
 * esse cookie em toda alteração feita pelo painel.
 */
export interface Usuario {
  nome: string
  email: string
}

export function sessaoAtual(): Promise<{ usuario: Usuario | null }> {
  return api('/auth/sessao')
}

export function entrar(email: string, senha: string): Promise<{ usuario: Usuario }> {
  return api('/auth/entrar', { method: 'POST', json: { email, senha } })
}

export function sair(): Promise<void> {
  return api('/auth/sair', { method: 'POST' })
}
