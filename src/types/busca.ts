import type { Bairro } from './coleta'

/** exata = o nome bateu; aproximada = nome parecido; nenhuma = bairro fora da lista */
export type Correspondencia = 'exata' | 'aproximada' | 'nenhuma'

export interface EnderecoCep {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
}

export interface RespostaCep {
  endereco: EnderecoCep
  /** true = CEP de outra cidade */
  foraDaArea: boolean
  correspondencia: Correspondencia
  bairros: Bairro[]
}

export interface EnderecoRua {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  correspondencia: Correspondencia
  bairroIds: string[]
}

export interface RespostaRua {
  enderecos: EnderecoRua[]
  bairros: Bairro[]
  /** true = a busca de ruas dos Correios falhou (vieram só os locais da lista) */
  servicoIndisponivel: boolean
}
