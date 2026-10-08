/*
 * Leitura e gravação no navegador (localStorage).
 * Usado só enquanto não existe backend: cada computador vê os próprios dados.
 */
export function lerDoNavegador<T>(chave: string, padrao: () => T): T {
  try {
    const salvo = localStorage.getItem(chave)
    if (salvo) return JSON.parse(salvo) as T
  } catch {
    // Dados corrompidos ou navegador sem acesso ao armazenamento: usa o padrão
  }
  return padrao()
}

export function gravarNoNavegador(chave: string, valor: unknown): void {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('O navegador ficou sem espaço para salvar. Use imagens menores ou exclua notícias antigas.')
    }
    throw new Error('Não foi possível salvar no navegador.')
  }
}

export function apagarDoNavegador(chave: string): void {
  try {
    localStorage.removeItem(chave)
  } catch {
    // Sem acesso ao armazenamento: não há nada para apagar
  }
}

/** Simula o tempo de resposta de um servidor, para as telas de carregamento aparecerem. */
export const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))
