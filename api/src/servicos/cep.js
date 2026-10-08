import { config } from '../config.js'
import { ErroHttp } from '../lib/erros.js'

/*
 * Consulta de CEP e de ruas.
 * Usa o ViaCEP (grátis, sem cadastro). Se ele estiver fora do ar, a busca
 * por CEP tenta a BrasilAPI. As respostas ficam guardadas por 1 dia em
 * memória, para não repetir a mesma consulta (o ViaCEP bloqueia abuso).
 */
const UM_DIA = 24 * 60 * 60 * 1000
const cache = new Map()

function lerCache(chave) {
  const item = cache.get(chave)
  if (item && item.expira > Date.now()) return item.valor
  cache.delete(chave)
  return undefined
}

function gravarCache(chave, valor) {
  if (cache.size >= 2000) cache.delete(cache.keys().next().value)
  cache.set(chave, { valor, expira: Date.now() + UM_DIA })
}

export class ServicoIndisponivel extends Error {}

async function pedirJson(url) {
  let resposta
  try {
    resposta = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'site-coovir/1.0 (coleta seletiva)' },
      signal: AbortSignal.timeout(6000),
    })
  } catch {
    throw new ServicoIndisponivel('Sem resposta do serviço de CEP.')
  }
  return resposta
}

const SEM_SERVICO = 'Não foi possível consultar o CEP agora. Tente de novo em alguns minutos ou busque pelo bairro.'

async function viaCep(cep) {
  const resposta = await pedirJson(`${config.viacepUrl}/${cep}/json/`)
  if (resposta.status === 400) throw new ErroHttp(400, 'CEP inválido. Confira os números.')
  if (!resposta.ok) throw new ServicoIndisponivel(`ViaCEP respondeu ${resposta.status}`)
  const dados = await resposta.json()
  // O ViaCEP responde { "erro": true } (ou "true") quando o CEP não existe
  if (dados.erro) throw new ErroHttp(404, 'CEP não encontrado. Confira os números.')
  return {
    cep: dados.cep,
    logradouro: dados.logradouro ?? '',
    complemento: dados.complemento ?? '',
    bairro: dados.bairro ?? '',
    cidade: dados.localidade ?? '',
    uf: dados.uf ?? '',
  }
}

async function brasilApi(cep) {
  const resposta = await pedirJson(`${config.brasilApiUrl}/${cep}`)
  if (resposta.status === 404) throw new ErroHttp(404, 'CEP não encontrado. Confira os números.')
  if (!resposta.ok) throw new ServicoIndisponivel(`BrasilAPI respondeu ${resposta.status}`)
  const dados = await resposta.json()
  return {
    cep: `${dados.cep.slice(0, 5)}-${dados.cep.slice(5)}`,
    logradouro: dados.street ?? '',
    complemento: '',
    bairro: dados.neighborhood ?? '',
    cidade: dados.city ?? '',
    uf: dados.state ?? '',
  }
}

/** Endereço de um CEP (8 números, sem traço). */
export async function consultarCep(cep) {
  const doCache = lerCache(`cep:${cep}`)
  if (doCache) return doCache
  let endereco
  try {
    endereco = await viaCep(cep)
  } catch (erro) {
    if (!(erro instanceof ServicoIndisponivel)) throw erro
    try {
      endereco = await brasilApi(cep)
    } catch (erroReserva) {
      if (erroReserva instanceof ServicoIndisponivel) throw new ErroHttp(503, SEM_SERVICO)
      throw erroReserva
    }
  }
  gravarCache(`cep:${cep}`, endereco)
  return endereco
}

/** Ruas da cidade configurada com esse nome (até 50 resultados do ViaCEP). */
export async function buscarRuas(texto) {
  // Só letras, números e espaços: uma "/" no nome quebraria o endereço da consulta
  const limpo = texto.replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim()
  const chave = `rua:${limpo.toLowerCase()}`
  const doCache = lerCache(chave)
  if (doCache) return doCache

  const url = `${config.viacepUrl}/${encodeURIComponent(config.uf)}/${encodeURIComponent(config.cidade)}/${encodeURIComponent(limpo)}/json/`
  const resposta = await pedirJson(url)
  if (resposta.status === 400) return []
  if (!resposta.ok) throw new ServicoIndisponivel(`ViaCEP respondeu ${resposta.status}`)
  const dados = await resposta.json()
  const ruas = Array.isArray(dados)
    ? dados.map((d) => ({ cep: d.cep, logradouro: d.logradouro ?? '', complemento: d.complemento ?? '', bairro: d.bairro ?? '' }))
    : []
  gravarCache(chave, ruas)
  return ruas
}
