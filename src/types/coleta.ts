import type { MultiPolygon, Polygon } from 'geojson'

/** 0 = domingo, 1 = segunda ... 6 = sábado (igual ao Date.getDay() do JavaScript) */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type Periodo = 'manha' | 'tarde' | 'noite'

export interface Turno {
  dia: DiaSemana
  periodo: Periodo
  /** Horário no formato "HH:MM". Opcional: deixe vazio se a empresa não divulga. */
  inicio?: string
  fim?: string
}

export interface Bairro {
  /** Identificador usado na URL, ex.: "jardim-das-flores" */
  id: string
  nome: string
  /** false = o bairro aparece no site como "sem coleta seletiva" */
  ativo: boolean
  turnos: Turno[]
  /** Limites do bairro no mapa (GeoJSON). Sem isso, o bairro aparece só na busca. */
  area?: Polygon | MultiPolygon
  /** Data da última alteração (ISO 8601) */
  atualizadoEm: string
}
