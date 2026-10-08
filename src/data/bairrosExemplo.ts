import type { Polygon } from 'geojson'
import type { Bairro } from '@/types/coleta'

/*
 * DADOS DE EXEMPLO — bairros, horários e áreas abaixo são fictícios.
 *
 * As áreas foram desenhadas numa grade e posicionadas no mar, de propósito,
 * para ninguém confundir com um lugar real. Troque tudo pelos dados do cliente:
 * os limites dos bairros costumam estar disponíveis em GeoJSON na prefeitura
 * ou no IBGE (malha de bairros).
 */
const ORIGEM = { lat: -30.55, lng: -49.75 }
const ESCALA = 0.0001 // graus por unidade da grade

/** Converte pontos da grade [x, y] em um polígono GeoJSON (que usa [longitude, latitude]). */
function area(pontos: [number, number][]): Polygon {
  const anel = pontos.map(([x, y]) => [ORIGEM.lng + x * ESCALA, ORIGEM.lat - y * ESCALA])
  const primeiro = anel[0]
  if (primeiro) anel.push(primeiro) // o GeoJSON exige que o polígono termine onde começou
  return { type: 'Polygon', coordinates: [anel] }
}

const ATUALIZADO = '2026-10-01T12:00:00.000Z'

export const BAIRROS_EXEMPLO: Bairro[] = [
  {
    id: 'bela-vista',
    nome: 'Bela Vista',
    ativo: true,
    turnos: [{ dia: 3, periodo: 'manha', inicio: '07:00', fim: '12:00' }],
    area: area([[30, 40], [180, 24], [168, 150], [24, 170]]),
    atualizadoEm: ATUALIZADO,
  },
  {
    id: 'centro',
    nome: 'Centro',
    ativo: true,
    turnos: [
      { dia: 2, periodo: 'manha', inicio: '07:00', fim: '12:00' },
      { dia: 5, periodo: 'manha', inicio: '07:00', fim: '12:00' },
    ],
    area: area([[168, 150], [318, 166], [462, 146], [476, 288], [330, 308], [186, 292]]),
    atualizadoEm: ATUALIZADO,
  },
  {
    id: 'industrial',
    nome: 'Industrial',
    ativo: true,
    turnos: [{ dia: 4, periodo: 'noite', inicio: '18:00', fim: '22:00' }],
    area: area([[330, 308], [476, 288], [480, 426], [338, 416]]),
    atualizadoEm: ATUALIZADO,
  },
  {
    id: 'jardim-das-flores',
    nome: 'Jardim das Flores',
    ativo: true,
    turnos: [
      { dia: 3, periodo: 'tarde', inicio: '13:00', fim: '18:00' },
      { dia: 5, periodo: 'tarde', inicio: '13:00', fim: '18:00' },
    ],
    area: area([[36, 300], [186, 292], [330, 308], [338, 416], [172, 424], [48, 410]]),
    atualizadoEm: ATUALIZADO,
  },
  {
    id: 'morada-do-sol',
    nome: 'Morada do Sol',
    ativo: false,
    turnos: [],
    area: area([[476, 288], [570, 312], [560, 404], [480, 426]]),
    atualizadoEm: ATUALIZADO,
  },
  {
    id: 'parque-das-aguas',
    nome: 'Parque das Águas',
    ativo: true,
    turnos: [
      { dia: 2, periodo: 'noite', inicio: '18:00', fim: '22:00' },
      { dia: 6, periodo: 'manha', inicio: '07:00', fim: '12:00' },
    ],
    area: area([[470, 22], [575, 48], [582, 176], [570, 312], [476, 288], [462, 146]]),
    atualizadoEm: ATUALIZADO,
  },
  {
    id: 'sao-jose',
    nome: 'São José',
    ativo: true,
    turnos: [
      { dia: 1, periodo: 'tarde', inicio: '13:00', fim: '18:00' },
      { dia: 4, periodo: 'tarde', inicio: '13:00', fim: '18:00' },
    ],
    area: area([[180, 24], [340, 36], [470, 22], [462, 146], [318, 166], [168, 150]]),
    atualizadoEm: ATUALIZADO,
  },
  {
    id: 'vila-nova',
    nome: 'Vila Nova',
    ativo: true,
    turnos: [
      { dia: 1, periodo: 'manha', inicio: '07:00', fim: '12:00' },
      { dia: 4, periodo: 'manha', inicio: '07:00', fim: '12:00' },
    ],
    area: area([[24, 170], [168, 150], [186, 292], [36, 300]]),
    atualizadoEm: ATUALIZADO,
  },
]
