import { Router } from 'express'
import { config } from '../config.js'
import { ErroHttp } from '../lib/erros.js'
import { normalizar } from '../lib/texto.js'
import { listarBairros } from '../servicos/bairros.js'
import { buscarRuas, consultarCep, ServicoIndisponivel } from '../servicos/cep.js'
import { encontrarBairros, filtrarPorNome } from '../servicos/correspondencia.js'

const router = Router()

// GET /api/busca/bairro?q=centro
router.get('/bairro', async (req, res) => {
  const texto = String(req.query.q ?? '')
  if (!normalizar(texto)) throw new ErroHttp(400, 'Digite o nome do bairro.')
  res.json({ bairros: filtrarPorNome(await listarBairros(), texto) })
})

// GET /api/busca/cep/94410000
router.get('/cep/:cep', async (req, res) => {
  const cep = String(req.params.cep).replace(/\D/g, '')
  if (cep.length !== 8) throw new ErroHttp(400, 'O CEP precisa ter 8 números.')

  const endereco = await consultarCep(cep)
  const naCidade = normalizar(endereco.cidade) === normalizar(config.cidade) && endereco.uf === config.uf
  if (!naCidade) {
    return res.json({ endereco, foraDaArea: true, correspondencia: 'nenhuma', bairros: [] })
  }
  const { correspondencia, bairros } = encontrarBairros(await listarBairros(), endereco)
  res.json({ endereco, foraDaArea: false, correspondencia, bairros })
})

// GET /api/busca/rua?q=capitao gentil
router.get('/rua', async (req, res) => {
  const texto = String(req.query.q ?? '').trim()
  if (normalizar(texto).replace(/ /g, '').length < 3) throw new ErroHttp(400, 'Digite pelo menos 3 letras do nome da rua.')

  const todos = await listarBairros()
  // 1) Locais da lista de coleta com esse nome (estradas, becos, trechos da RS-040...)
  const porNome = filtrarPorNome(todos, texto)

  // 2) Ruas da cidade com esse nome, segundo o ViaCEP, ligadas aos bairros da lista
  let ruas = []
  let servicoIndisponivel = false
  try {
    ruas = await buscarRuas(texto)
  } catch (erro) {
    if (!(erro instanceof ServicoIndisponivel)) throw erro
    servicoIndisponivel = true
  }

  const vistos = new Set()
  const enderecos = []
  const encontrados = new Map(porNome.map((b) => [b.id, b]))
  for (const rua of ruas) {
    const chave = normalizar(`${rua.logradouro} ${rua.bairro}`)
    if (vistos.has(chave)) continue // o ViaCEP repete a rua para cada faixa de números
    vistos.add(chave)
    const { correspondencia, bairros } = encontrarBairros(todos, rua)
    for (const b of bairros) encontrados.set(b.id, b)
    enderecos.push({ ...rua, correspondencia, bairroIds: bairros.map((b) => b.id) })
    if (enderecos.length === 20) break
  }

  res.json({ enderecos, bairros: [...encontrados.values()], servicoIndisponivel })
})

export default router
