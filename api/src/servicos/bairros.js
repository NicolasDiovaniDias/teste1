import { pool } from '../db.js'

const ORDEM_PERIODO = "CASE periodo WHEN 'manha' THEN 0 WHEN 'tarde' THEN 1 ELSE 2 END"
const ordemAlfabetica = new Intl.Collator('pt-BR').compare

function montar(bairro, turnos) {
  return {
    id: bairro.id,
    nome: bairro.nome,
    ativo: bairro.ativo,
    apelidos: bairro.apelidos,
    ...(bairro.area ? { area: bairro.area } : {}),
    turnos: turnos.map((t) => ({
      dia: t.dia,
      periodo: t.periodo,
      ...(t.inicio ? { inicio: t.inicio } : {}),
      ...(t.fim ? { fim: t.fim } : {}),
    })),
    atualizadoEm: bairro.atualizado_em,
  }
}

/** Todos os bairros com seus turnos, em ordem alfabética. */
export async function listarBairros(db = pool) {
  const [{ rows: bairros }, { rows: turnos }] = await Promise.all([
    db.query('SELECT id, nome, ativo, apelidos, area, atualizado_em FROM bairros'),
    db.query(
      `SELECT bairro_id, dia, periodo, to_char(inicio, 'HH24:MI') AS inicio, to_char(fim, 'HH24:MI') AS fim
         FROM turnos ORDER BY dia, ${ORDEM_PERIODO}, inicio NULLS FIRST`,
    ),
  ])
  const porBairro = new Map()
  for (const turno of turnos) {
    if (!porBairro.has(turno.bairro_id)) porBairro.set(turno.bairro_id, [])
    porBairro.get(turno.bairro_id).push(turno)
  }
  return bairros.map((b) => montar(b, porBairro.get(b.id) ?? [])).sort((a, b) => ordemAlfabetica(a.nome, b.nome))
}

export async function buscarBairro(db, id) {
  const { rows } = await db.query('SELECT id, nome, ativo, apelidos, area, atualizado_em FROM bairros WHERE id = $1', [id])
  if (!rows[0]) return null
  const { rows: turnos } = await db.query(
    `SELECT dia, periodo, to_char(inicio, 'HH24:MI') AS inicio, to_char(fim, 'HH24:MI') AS fim
       FROM turnos WHERE bairro_id = $1 ORDER BY dia, ${ORDEM_PERIODO}, inicio NULLS FIRST`,
    [id],
  )
  return montar(rows[0], turnos)
}
