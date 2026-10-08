/**
 * Chamadas para a API do site (pasta api).
 * Em desenvolvimento, o Vite encaminha /api para http://localhost:3000 (veja vite.config.ts).
 * Em produção, a API e o site ficam no mesmo endereço.
 */
export class ErroApi extends Error {
  status: number
  campos?: Record<string, string>

  constructor(status: number, mensagem: string, campos?: Record<string, string>) {
    super(mensagem)
    this.status = status
    this.campos = campos
  }
}

interface Opcoes {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /** Objeto enviado como JSON */
  json?: unknown
  /** Corpo enviado do jeito que está (ex.: uma imagem) */
  corpo?: Blob
  headers?: Record<string, string>
}

export async function api<T>(caminho: string, { method = 'GET', json, corpo, headers = {} }: Opcoes = {}): Promise<T> {
  let resposta: Response
  try {
    resposta = await fetch(`/api${caminho}`, {
      method,
      credentials: 'same-origin', // envia o cookie de login
      headers: { Accept: 'application/json', ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: json !== undefined ? JSON.stringify(json) : corpo,
    })
  } catch {
    throw new ErroApi(0, 'Sem conexão com o servidor. Confira sua internet e tente de novo.')
  }

  if (resposta.status === 204) return undefined as T
  const dados = await resposta.json().catch(() => null)
  if (!resposta.ok) {
    throw new ErroApi(resposta.status, dados?.erro ?? 'Erro inesperado no servidor. Tente de novo.', dados?.campos)
  }
  return dados as T
}

/** Mensagem pronta para mostrar na tela, venha o erro de onde vier */
export function mensagemDeErro(erro: unknown, padrao = 'Algo deu errado. Tente de novo.'): string {
  return erro instanceof Error && erro.message ? erro.message : padrao
}
