import type { Bairro, DiaSemana, Periodo, Turno } from '@/types/coleta'

export const ORDEM_DIAS: DiaSemana[] = [0, 1, 2, 3, 4, 5, 6]

export const DIAS: Record<DiaSemana, { nome: string; curto: string }> = {
  0: { nome: 'Domingo', curto: 'Dom' },
  1: { nome: 'Segunda-feira', curto: 'Seg' },
  2: { nome: 'Terça-feira', curto: 'Ter' },
  3: { nome: 'Quarta-feira', curto: 'Qua' },
  4: { nome: 'Quinta-feira', curto: 'Qui' },
  5: { nome: 'Sexta-feira', curto: 'Sex' },
  6: { nome: 'Sábado', curto: 'Sáb' },
}

export const PERIODOS: Record<Periodo, { nome: string; frase: string }> = {
  manha: { nome: 'Manhã', frase: 'de manhã' },
  tarde: { nome: 'Tarde', frase: 'à tarde' },
  noite: { nome: 'Noite', frase: 'à noite' },
}

const ORDEM_PERIODO: Record<Periodo, number> = { manha: 0, tarde: 1, noite: 2 }

/** Quando o turno não tem horário de fim, consideramos estes limites. */
const FIM_PADRAO: Record<Periodo, string> = { manha: '12:00', tarde: '18:00', noite: '23:59' }

/** "07:30" -> "7h30", "13:00" -> "13h" */
export function formatarHora(hora: string): string {
  const [h = '0', m = '00'] = hora.split(':')
  const horas = String(Number(h))
  return m === '00' ? `${horas}h` : `${horas}h${m}`
}

/** "das 7h às 12h" (ou texto vazio se o turno não tem horário) */
export function descreverHorario(turno: Turno): string {
  if (turno.inicio && turno.fim) return `das ${formatarHora(turno.inicio)} às ${formatarHora(turno.fim)}`
  if (turno.inicio) return `a partir das ${formatarHora(turno.inicio)}`
  return ''
}

export function ordenarTurnos(turnos: Turno[]): Turno[] {
  return [...turnos].sort(
    (a, b) =>
      a.dia - b.dia ||
      ORDEM_PERIODO[a.periodo] - ORDEM_PERIODO[b.periodo] ||
      (a.inicio ?? '').localeCompare(b.inicio ?? ''),
  )
}

/** Resumo curto para listas: "Ter, manhã" */
export function resumirTurno(turno: Turno): string {
  return `${DIAS[turno.dia].curto}, ${PERIODOS[turno.periodo].nome.toLowerCase()}`
}

export interface ProximaColeta {
  data: Date
  turno: Turno
  diasAte: number
}

function minutos(hora: string): number {
  const [h = 0, m = 0] = hora.split(':').map(Number)
  return h * 60 + m
}

function jaTerminou(turno: Turno, agora: Date): boolean {
  const fim = turno.fim ?? FIM_PADRAO[turno.periodo]
  return agora.getHours() * 60 + agora.getMinutes() >= minutos(fim)
}

/**
 * Descobre a próxima coleta a partir de agora.
 * Se a coleta de hoje já terminou, pula para a próxima (até uma semana depois).
 */
export function proximaColeta(bairro: Bairro, agora: Date = new Date()): ProximaColeta | null {
  if (!bairro.ativo || bairro.turnos.length === 0) return null
  const turnos = ordenarTurnos(bairro.turnos)

  for (let diasAte = 0; diasAte <= 7; diasAte++) {
    const data = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + diasAte)
    for (const turno of turnos) {
      if (turno.dia !== data.getDay()) continue
      if (diasAte === 0 && jaTerminou(turno, agora)) continue
      return { data, turno, diasAte }
    }
  }
  return null
}

/** Texto da próxima coleta: { titulo: "Amanhã", detalhe: "6 de outubro, de manhã, das 7h às 12h" } */
export function descreverProximaColeta(proxima: ProximaColeta): { titulo: string; detalhe: string } {
  const { data, turno, diasAte } = proxima
  const titulo = diasAte === 0 ? 'Hoje' : diasAte === 1 ? 'Amanhã' : DIAS[data.getDay() as DiaSemana].nome
  const diaDoMes = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(data)
  const detalhe = [diaDoMes, PERIODOS[turno.periodo].frase, descreverHorario(turno)].filter(Boolean).join(', ')
  return { titulo, detalhe }
}
