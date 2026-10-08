import { normalizar } from '../lib/texto.js'

/*
 * Liga o endereço dos Correios (bairro e rua) aos bairros da lista de coleta.
 * Os nomes nem sempre batem ("Jardim Krahe" x "Krahe"), por isso há dois níveis:
 *   exata      = o nome (ou um dos outros nomes) é igual
 *   aproximada = um nome contém o outro, palavra por palavra
 * Quando a busca vier aproximada, vale cadastrar o nome dos Correios como
 * "outro nome" do bairro no painel: da próxima vez ela vem exata.
 */

// Nome sem o trecho entre parênteses: "RS-040 (parada 63 até 140)" -> "rs 040"
const nomeBase = (nome) => normalizar(String(nome).replace(/\(.*?\)/g, ' '))

/** Nomes do bairro já normalizados (nome principal + outros nomes) */
export const nomesDe = (bairro) => [bairro.nome, ...(bairro.apelidos ?? [])].map(normalizar)

// "jardim krahe" contém a palavra "krahe"; "jardim" não contém "jari"
const contemPalavras = (texto, trecho) => Boolean(trecho) && ` ${texto} `.includes(` ${trecho} `)

// Locais da lista que são ruas, estradas ou rodovias (comparados com o logradouro)
const PARECE_RUA = /^(rua|avenida|av|estrada|beco|caminho|rodovia|travessa|passagem|rs|br) /

/** Bairros da lista de coleta que correspondem a um endereço. */
export function encontrarBairros(bairros, { bairro, logradouro }) {
  const alvo = normalizar(bairro)
  const rua = normalizar(logradouro)

  const porBairro = alvo ? bairros.filter((b) => nomesDe(b).includes(alvo)) : []
  const porRua = rua
    ? bairros.filter((b) => {
        const base = nomeBase(b.nome)
        return PARECE_RUA.test(`${base} `) && contemPalavras(rua, base)
      })
    : []
  const exatos = [...new Set([...porBairro, ...porRua])]
  if (exatos.length) return { correspondencia: 'exata', bairros: exatos }

  const aproximados = alvo
    ? bairros.filter((b) => nomesDe(b).some((nome) => contemPalavras(alvo, nome) || contemPalavras(nome, alvo)))
    : []
  if (aproximados.length) return { correspondencia: 'aproximada', bairros: aproximados }

  return { correspondencia: 'nenhuma', bairros: [] }
}

/** Bairros cujo nome contém o texto digitado (busca por bairro ou nome de estrada). */
export function filtrarPorNome(bairros, texto) {
  const termo = normalizar(texto)
  if (!termo) return []
  return bairros.filter((b) => nomesDe(b).some((nome) => nome.includes(termo)))
}
