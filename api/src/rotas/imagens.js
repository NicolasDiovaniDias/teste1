import express, { Router } from 'express'
import { pool } from '../db.js'
import { ErroHttp } from '../lib/erros.js'
import { exigirLogin } from '../sessao.js'

const router = Router()
const TIPOS = ['image/jpeg', 'image/png', 'image/webp']
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

// Confere os primeiros bytes do arquivo: não basta o navegador dizer que é imagem
function ehImagem(tipo, dados) {
  if (tipo === 'image/jpeg') return dados[0] === 0xff && dados[1] === 0xd8 && dados[2] === 0xff
  if (tipo === 'image/png') return dados.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  if (tipo === 'image/webp') return dados.toString('ascii', 0, 4) === 'RIFF' && dados.toString('ascii', 8, 12) === 'WEBP'
  return false
}

/** Apaga do banco uma imagem desta API ("/api/imagens/<id>"), se for o caso. */
export async function apagarImagem(db, url) {
  const id = String(url ?? '').match(/^\/api\/imagens\/(.+)$/)?.[1]
  if (id && UUID.test(id)) await db.query('DELETE FROM imagens WHERE id = $1', [id])
}

// POST /api/imagens: recebe o arquivo puro (o site já reduz a foto antes de enviar)
router.post('/', exigirLogin, express.raw({ type: TIPOS, limit: '3mb' }), async (req, res) => {
  const tipo = String(req.headers['content-type'] ?? '').split(';')[0].trim()
  if (!Buffer.isBuffer(req.body) || !req.body.length || !TIPOS.includes(tipo) || !ehImagem(tipo, req.body)) {
    throw new ErroHttp(400, 'Envie uma imagem JPG, PNG ou WebP.')
  }
  // Faxina: imagens enviadas há mais de 1 dia que nenhuma notícia usa
  await pool.query(
    `DELETE FROM imagens i
      WHERE i.criada_em < now() - interval '1 day'
        AND NOT EXISTS (SELECT 1 FROM noticias n WHERE n.imagem = '/api/imagens/' || i.id)`,
  )
  const { rows } = await pool.query('INSERT INTO imagens (tipo, dados) VALUES ($1, $2) RETURNING id', [tipo, req.body])
  res.status(201).json({ url: `/api/imagens/${rows[0].id}` })
})

// GET /api/imagens/:id
router.get('/:id', async (req, res) => {
  if (!UUID.test(req.params.id)) throw new ErroHttp(404, 'Imagem não encontrada.')
  const { rows } = await pool.query('SELECT tipo, dados FROM imagens WHERE id = $1', [req.params.id])
  if (!rows[0]) throw new ErroHttp(404, 'Imagem não encontrada.')
  // A imagem nunca muda (uma nova ganha outro id), então o navegador pode guardar para sempre
  res.set({ 'Content-Type': rows[0].tipo, 'Cache-Control': 'public, max-age=31536000, immutable' })
  res.send(rows[0].dados)
})

export default router
