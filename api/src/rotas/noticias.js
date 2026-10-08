import { Router } from 'express'
import { pool, transacao } from '../db.js'
import { ErroHttp } from '../lib/erros.js'
import { idSchema, noticiaSchema, validar } from '../lib/validacao.js'
import { exigirLogin } from '../sessao.js'
import { apagarImagem } from './imagens.js'

export const CAMPOS_NOTICIA = `
  id, titulo, resumo, conteudo, imagem, imagem_descricao AS "imagemDescricao",
  to_char(publicada_em, 'YYYY-MM-DD') AS "publicadaEm", publicada, atualizado_em AS "atualizadoEm"`

// "No ar" = publicada e com data de hoje ou anterior, no horário de Brasília
export const NO_AR = `publicada AND publicada_em <= (now() AT TIME ZONE 'America/Sao_Paulo')::date`

// Tira os campos vazios da resposta (imagem e descrição são opcionais)
export function limparNoticia(noticia) {
  const { imagem, imagemDescricao, ...resto } = noticia
  return { ...resto, ...(imagem ? { imagem } : {}), ...(imagemDescricao ? { imagemDescricao } : {}) }
}

const router = Router()

// GET /api/noticias: só as que estão no ar, mais novas primeiro
router.get('/', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS_NOTICIA} FROM noticias WHERE ${NO_AR} ORDER BY publicada_em DESC, atualizado_em DESC`,
  )
  res.json(rows.map(limparNoticia))
})

// GET /api/noticias/:id: quem está logado vê também rascunhos e agendadas (pré-visualização)
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS_NOTICIA} FROM noticias WHERE id = $1 ${req.usuario ? '' : `AND ${NO_AR}`}`,
    [req.params.id],
  )
  if (!rows[0]) throw new ErroHttp(404, 'Notícia não encontrada.')
  res.json(limparNoticia(rows[0]))
})

// PUT /api/noticias/:id: cria ou atualiza
router.put('/:id', exigirLogin, async (req, res) => {
  const id = validar(idSchema, req.params.id)
  const dados = validar(noticiaSchema, req.body)

  const salva = await transacao(async (db) => {
    const anterior = (await db.query('SELECT imagem FROM noticias WHERE id = $1 FOR UPDATE', [id])).rows[0]
    const { rows } = await db.query(
      `INSERT INTO noticias (id, titulo, resumo, conteudo, imagem, imagem_descricao, publicada_em, publicada, atualizado_em)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
       ON CONFLICT (id) DO UPDATE
         SET titulo = EXCLUDED.titulo, resumo = EXCLUDED.resumo, conteudo = EXCLUDED.conteudo,
             imagem = EXCLUDED.imagem, imagem_descricao = EXCLUDED.imagem_descricao,
             publicada_em = EXCLUDED.publicada_em, publicada = EXCLUDED.publicada, atualizado_em = now()
       RETURNING ${CAMPOS_NOTICIA}`,
      [
        id,
        dados.titulo,
        dados.resumo,
        dados.conteudo,
        dados.imagem ?? null,
        dados.imagem ? (dados.imagemDescricao ?? null) : null,
        dados.publicadaEm,
        dados.publicada,
      ],
    )
    // Trocou ou tirou a imagem: apaga a antiga para não ocupar espaço
    if (anterior?.imagem && anterior.imagem !== dados.imagem) await apagarImagem(db, anterior.imagem)
    return rows[0]
  })
  res.json(limparNoticia(salva))
})

// DELETE /api/noticias/:id
router.delete('/:id', exigirLogin, async (req, res) => {
  await transacao(async (db) => {
    const { rows } = await db.query('DELETE FROM noticias WHERE id = $1 RETURNING imagem', [req.params.id])
    if (!rows[0]) throw new ErroHttp(404, 'Notícia não encontrada.')
    await apagarImagem(db, rows[0].imagem)
  })
  res.status(204).end()
})

export default router
