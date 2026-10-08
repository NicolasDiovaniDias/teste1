import { Router } from 'express'
import { pool } from '../db.js'
import { exigirLogin } from '../sessao.js'
import { CAMPOS_NOTICIA, limparNoticia } from './noticias.js'

/** Rotas só do painel (todas exigem login). */
const router = Router()
router.use(exigirLogin)

// GET /api/painel/noticias: todas, inclusive rascunhos e agendadas
router.get('/noticias', async (_req, res) => {
  const { rows } = await pool.query(`SELECT ${CAMPOS_NOTICIA} FROM noticias ORDER BY publicada_em DESC, atualizado_em DESC`)
  res.json(rows.map(limparNoticia))
})

export default router
