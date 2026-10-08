import { randomBytes } from 'node:crypto'
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { pool } from '../db.js'
import { ErroHttp } from '../lib/erros.js'
import { conferirSenha, gerarHash } from '../lib/senhas.js'
import { loginSchema, validar } from '../lib/validacao.js'
import { criarSessao, encerrarSessao } from '../sessao.js'

const router = Router()

// No máximo 10 tentativas de login a cada 15 minutos por endereço de internet
const limiteDeTentativas = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Espere 15 minutos e tente de novo.' },
})

// Usado quando o e-mail não existe, para a resposta demorar o mesmo tempo
const HASH_FALSO = await gerarHash(randomBytes(16).toString('hex'))

// POST /api/auth/entrar  { email, senha }
router.post('/entrar', limiteDeTentativas, async (req, res) => {
  const { email, senha } = validar(loginSchema, req.body)
  const { rows } = await pool.query('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1', [email])
  const usuario = rows[0]
  const senhaCerta = await conferirSenha(senha, usuario?.senha_hash ?? HASH_FALSO)
  if (!usuario || !senhaCerta) throw new ErroHttp(401, 'E-mail ou senha incorretos. Confira e tente de novo.')

  await criarSessao(res, usuario.id)
  res.json({ usuario: { nome: usuario.nome, email: usuario.email } })
})

// POST /api/auth/sair
router.post('/sair', async (req, res) => {
  await encerrarSessao(req, res)
  res.status(204).end()
})

// GET /api/auth/sessao: quem está logado (ou usuario: null)
router.get('/sessao', (req, res) => {
  res.json({ usuario: req.usuario ? { nome: req.usuario.nome, email: req.usuario.email } : null })
})

export default router
