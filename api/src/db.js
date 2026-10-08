import pg from 'pg'
import { config } from './config.js'

/** Conexões com o Postgres, reaproveitadas entre as requisições. */
export const pool = new pg.Pool({ connectionString: config.bancoUrl, max: 10 })

// Se o banco reiniciar, uma conexão parada dá erro aqui. Sem este aviso, a API inteira cairia.
pool.on('error', (erro) => console.error('Conexão com o banco caiu (a próxima consulta abre outra):', erro.message))

/** Roda várias consultas de uma vez: ou todas dão certo, ou nenhuma é salva. */
export async function transacao(funcao) {
  const cliente = await pool.connect()
  try {
    await cliente.query('BEGIN')
    const resultado = await funcao(cliente)
    await cliente.query('COMMIT')
    return resultado
  } catch (erro) {
    await cliente.query('ROLLBACK')
    throw erro
  } finally {
    cliente.release()
  }
}
