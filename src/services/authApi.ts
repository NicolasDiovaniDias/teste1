/*
 * Login de DEMONSTRAÇÃO. Não use assim em produção!
 *
 * No site real, quem confere e-mail e senha é o backend. Ele devolve um token
 * (de preferência num cookie httpOnly) e valida esse token em toda requisição
 * do painel. Esconder a tela no front-end não protege nada sozinho.
 */
export interface Usuario {
  nome: string
  email: string
}

export const CREDENCIAIS_DEMO = { email: 'admin@exemplo.com', senha: 'coleta123' }

export async function entrar(email: string, senha: string): Promise<Usuario> {
  await new Promise((resolver) => setTimeout(resolver, 400))
  if (email.trim().toLowerCase() === CREDENCIAIS_DEMO.email && senha === CREDENCIAIS_DEMO.senha) {
    return { nome: 'Administrador', email: CREDENCIAIS_DEMO.email }
  }
  throw new Error('E-mail ou senha incorretos. Confira e tente de novo.')
}
