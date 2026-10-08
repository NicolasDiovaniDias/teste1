// Roda arquivos .sql no banco do DATABASE_URL. Uso: node scripts/rodar-sql.js db/schema.sql db/seed.sql
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pool } from '../src/db.js'

try {
  for (const arquivo of process.argv.slice(2)) {
    const sql = await readFile(path.resolve(arquivo), 'utf8')
    await pool.query(sql)
    console.log(`OK: ${arquivo}`)
  }
} catch (erro) {
  console.error(`Erro ao rodar o SQL: ${erro.message}`)
  process.exitCode = 1
} finally {
  await pool.end()
}
