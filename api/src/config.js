import { fileURLToPath } from 'node:url'

/** Configurações lidas das variáveis de ambiente (arquivo .env no seu computador). */
export const config = {
  porta: Number(process.env.PORT ?? 3000),
  producao: process.env.NODE_ENV === 'production',
  bancoUrl: process.env.DATABASE_URL,
  cidade: process.env.CIDADE ?? 'Viamão',
  uf: process.env.UF ?? 'RS',
  // Serviços de CEP. Dá para trocar o endereço nos testes.
  viacepUrl: process.env.VIACEP_URL ?? 'https://viacep.com.br/ws',
  brasilApiUrl: process.env.BRASILAPI_URL ?? 'https://brasilapi.com.br/api/cep/v2',
  // Pasta com o site já "buildado" (npm run build na raiz do projeto)
  pastaSite: process.env.PASTA_SITE ?? fileURLToPath(new URL('../../dist', import.meta.url)),
}

if (!config.bancoUrl) {
  throw new Error('Defina DATABASE_URL no arquivo .env (copie o .env.exemplo).')
}
