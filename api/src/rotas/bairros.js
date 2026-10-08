import { Router } from 'express'
import { pool, transacao } from '../db.js'
import { ErroHttp } from '../lib/erros.js'
import { bairroSchema, idSchema, validar } from '../lib/validacao.js'
import { exigirLogin } from '../sessao.js'
import { buscarBairro, listarBairros } from '../servicos/bairros.js'

const router = Router()

// GET /api/bairros: todos os bairros com os turnos (usado na consulta e no painel)
router.get('/', async (_req, res) => {
  res.json(await listarBairros())
})

// PUT /api/bairros/:id: cria ou atualiza um bairro e substitui os turnos dele
router.put('/:id', exigirLogin, async (req, res) => {
  const id = validar(idSchema, req.params.id)
  const dados = validar(bairroSchema, req.body)

  const salvo = await transacao(async (db) => {
    await db.query(
      `INSERT INTO bairros (id, nome, ativo, apelidos, area, atualizado_em)
       VALUES ($1, $2, $3, $4, $5, now())
       ON CONFLICT (id) DO UPDATE
         SET nome = EXCLUDED.nome, ativo = EXCLUDED.ativo, apelidos = EXCLUDED.apelidos,
             area = EXCLUDED.area, atualizado_em = now()`,
      [id, dados.nome, dados.ativo, dados.apelidos, dados.area ?? null],
    )
    await db.query('DELETE FROM turnos WHERE bairro_id = $1', [id])
    for (const turno of dados.turnos) {
      await db.query('INSERT INTO turnos (bairro_id, dia, periodo, inicio, fim) VALUES ($1, $2, $3, $4, $5)', [
        id,
        turno.dia,
        turno.periodo,
        turno.inicio ?? null,
        turno.fim ?? null,
      ])
    }
    return buscarBairro(db, id)
  })
  res.json(salvo)
})

// DELETE /api/bairros/:id
router.delete('/:id', exigirLogin, async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM bairros WHERE id = $1', [req.params.id])
  if (!rowCount) throw new ErroHttp(404, 'Bairro não encontrado.')
  res.status(204).end()
})

export default router
