import { createHash, randomBytes } from 'node:crypto'
import { config } from './config.js'
import { pool } from './db.js'
import { ErroHttp } from './lib/erros.js'

export const COOKIE_SESSAO = 'coovir_sessao'
const DURACAO_MS = 7 * 24 * 60 * 60 * 1000 // 7 dias

// O cookie leva um token aleatório; o banco guarda só o hash dele
const hashDoToken = (token) => createHash('sha256').update(token).digest('hex')

export async function criarSessao(res, usuarioId) {
  const token = randomBytes(32).toString('base64url')
  const expiraEm = new Date(Date.now() + DURACAO_MS)
  await pool.query('DELETE FROM sessoes WHERE expira_em < now()')
  await pool.query('INSERT INTO sessoes (token_hash, usuario_id, expira_em) VALUES ($1, $2, $3)', [
    hashDoToken(token),
    usuarioId,
    expiraEm,
  ])
  res.cookie(COOKIE_SESSAO, token, {
    httpOnly: true, // o JavaScript da página não consegue ler o cookie
    sameSite: 'lax', // outros sites não conseguem usar a sessão
    secure: config.producao, // em produção, só por HTTPS
    expires: expiraEm,
    path: '/',
  })
}

export async function encerrarSessao(req, res) {
  const token = req.cookies?.[COOKIE_SESSAO]
  if (token) await pool.query('DELETE FROM sessoes WHERE token_hash = $1', [hashDoToken(token)])
  res.clearCookie(COOKIE_SESSAO, { path: '/' })
}

/** Descobre quem está logado (req.usuario). Não bloqueia ninguém. */
export async function carregarUsuario(req, _res, next) {
  req.usuario = null
  const token = req.cookies?.[COOKIE_SESSAO]
  if (token) {
    const { rows } = await pool.query(
      `SELECT u.id, u.nome, u.email
         FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.token_hash = $1 AND s.expira_em > now()`,
      [hashDoToken(token)],
    )
    req.usuario = rows[0] ?? null
  }
  next()
}

/** Bloqueia a rota para quem não está logado no painel. */
export function exigirLogin(req, _res, next) {
  if (!req.usuario) throw new ErroHttp(401, 'Entre no painel para continuar.')
  next()
}
