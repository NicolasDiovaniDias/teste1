import type { Component } from 'vue'
import { BottleWine, CanSoda, Milk, Newspaper } from '@lucide/vue'

export interface Material {
  nome: string
  icone: Component
  /** Cor do padrão da coleta seletiva (classe do Tailwind) */
  classeCor: string
  /** Cor do texto sobre essa cor, com contraste suficiente */
  classeTexto: string
  pode: string[]
  naoPode: string[]
}

export const MATERIAIS: Material[] = [
  {
    nome: 'Papel',
    icone: Newspaper,
    classeCor: 'bg-papel',
    classeTexto: 'text-white',
    pode: [
      'Jornais, revistas e folhetos',
      'Caixas de papelão desmontadas',
      'Folhas de caderno e de impressão',
      'Envelopes e embalagens longa vida',
    ],
    naoPode: ['Papel higiênico e guardanapo usados', 'Papel engordurado ou molhado', 'Fotografias e papel carbono'],
  },
  {
    nome: 'Plástico',
    icone: Milk,
    classeCor: 'bg-plastico',
    classeTexto: 'text-white',
    pode: ['Garrafas PET e tampinhas', 'Potes e embalagens de limpeza', 'Sacolas e sacos plásticos', 'Baldes e bacias'],
    naoPode: ['Embalagens com restos de comida', 'Cabos de panela e tomadas', 'Esponjas de lavar louça'],
  },
  {
    nome: 'Vidro',
    icone: BottleWine,
    classeCor: 'bg-vidro',
    classeTexto: 'text-white',
    pode: ['Garrafas de bebida', 'Potes e vidros de conserva', 'Frascos de molho, perfume e limpeza'],
    naoPode: ['Espelhos e vidros de janela', 'Cerâmica, porcelana e louça', 'Vidro quebrado solto, sem embrulho'],
  },
  {
    nome: 'Metal',
    icone: CanSoda,
    classeCor: 'bg-metal',
    classeTexto: 'text-[#2b2105]',
    pode: [
      'Latas de refrigerante e de cerveja',
      'Latas de conserva e de leite em pó',
      'Tampas e panelas sem cabo',
      'Arames, pregos e parafusos',
    ],
    naoPode: ['Pilhas e baterias', 'Latas de tinta ou de veneno', 'Esponjas de aço'],
  },
]
