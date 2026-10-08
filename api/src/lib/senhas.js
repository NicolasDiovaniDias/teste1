import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

// scrypt já vem no Node e é feito para senhas: lento de propósito para dificultar ataques
const scryptAsync = promisify(scrypt)

/** Gera o texto salvo no banco: "scrypt$<sal>$<hash>". A senha em si nunca é guardada. */
export async function gerarHash(senha) {
  const sal = randomBytes(16)
  const hash = await scryptAsync(senha, sal, 64)
  return `scrypt$${sal.toString('base64')}$${hash.toString('base64')}`
}

export async function conferirSenha(senha, salvo) {
  const [algoritmo, sal, hash] = String(salvo).split('$')
  if (algoritmo !== 'scrypt' || !sal || !hash) return false
  const esperado = Buffer.from(hash, 'base64')
  const calculado = await scryptAsync(senha, Buffer.from(sal, 'base64'), esperado.length)
  return timingSafeEqual(calculado, esperado)
}
