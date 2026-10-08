// Cria (ou atualiza a senha de) um usuário do painel.
// Uso: npm run admin:criar
//  ou: npm run admin:criar -- --nome "Fulana" --email fulana@exemplo.com --senha "uma senha forte"
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { parseArgs } from 'node:util'
import { pool } from '../src/db.js'
import { gerarHash } from '../src/lib/senhas.js'

const { values } = parseArgs({ options: { nome: { type: 'string' }, email: { type: 'string' }, senha: { type: 'string' } } })

let { nome, email, senha } = values
if (!nome || !email || !senha) {
  const perguntas = createInterface({ input: stdin, output: stdout })
  nome ??= await perguntas.question('Nome: ')
  email ??= await perguntas.question('E-mail: ')
  senha ??= await perguntas.question('Senha (mínimo 8 caracteres): ')
  perguntas.close()
}

nome = nome.trim()
email = email.trim().toLowerCase()

try {
  if (!nome || !email.includes('@')) throw new Error('Informe nome e um e-mail válido.')
  if (senha.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.')
  await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome, senha_hash = EXCLUDED.senha_hash`,
    [nome, email, await gerarHash(senha)],
  )
  console.log(`Pronto: ${email} já pode entrar no painel.`)
} catch (erro) {
  console.error(`Não foi possível criar o usuário: ${erro.message}`)
  process.exitCode = 1
} finally {
  await pool.end()
}
