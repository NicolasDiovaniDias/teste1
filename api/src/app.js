import { existsSync } from 'node:fs'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import { config } from './config.js'
import { pool } from './db.js'
import { tratarErros } from './lib/erros.js'
import rotasAuth from './rotas/auth.js'
import rotasBairros from './rotas/bairros.js'
import rotasBusca from './rotas/busca.js'
import rotasImagens from './rotas/imagens.js'
import rotasNoticias from './rotas/noticias.js'
import rotasPainel from './rotas/painel.js'
import { carregarUsuario } from './sessao.js'

export function criarApp() {
  const app = express()

  // No Render a requisição passa por um proxy: assim o limite de login enxerga o IP real
  if (config.producao) app.set('trust proxy', 1)

  // Cabeçalhos de segurança (inclui a política de conteúdo do site)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'img-src': ["'self'", 'data:', 'blob:', 'https://tile.openstreetmap.org'],
          // Sem HTTPS no seu computador, então só liga em produção
          'upgrade-insecure-requests': config.producao ? [] : null,
        },
      },
    }),
  )
  app.use(express.json({ limit: '100kb' }))
  app.use(cookieParser())

  // ---- API ----
  const api = express.Router()
  api.use(carregarUsuario)
  api.get('/saude', async (_req, res) => {
    await pool.query('SELECT 1')
    res.json({ ok: true })
  })
  api.use('/auth', rotasAuth)
  api.use('/bairros', rotasBairros)
  api.use('/busca', rotasBusca)
  api.use('/noticias', rotasNoticias)
  api.use('/imagens', rotasImagens)
  api.use('/painel', rotasPainel)
  api.use((_req, res) => res.status(404).json({ erro: 'Rota da API não encontrada.' }))
  app.use('/api', api)

  // ---- Site (em produção a API também entrega o site, no mesmo endereço) ----
  const index = path.join(config.pastaSite, 'index.html')
  if (existsSync(index)) {
    // Arquivos com "hash" no nome nunca mudam: o navegador pode guardar por 1 ano
    app.use('/assets', express.static(path.join(config.pastaSite, 'assets'), { immutable: true, maxAge: '1y' }))
    app.use(express.static(config.pastaSite, { index: false }))
    // Qualquer outro endereço (/consulta, /admin...) abre o index.html e o Vue Router resolve
    app.get('/{*caminho}', (_req, res) => res.set('Cache-Control', 'no-cache').sendFile(index))
  }

  app.use(tratarErros)
  return app
}
