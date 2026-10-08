/** Converte uma data em "AAAA-MM-DD", no fuso do computador da pessoa */
export function paraISO(data: Date): string {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

/** Data de hoje no formato AAAA-MM-DD */
export function hojeISO(): string {
  return paraISO(new Date())
}

/** Soma dias a hoje: diasAPartirDeHoje(-2) = anteontem */
export function diasAPartirDeHoje(dias: number): string {
  const hoje = new Date()
  return paraISO(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + dias))
}

/**
 * Converte "2026-10-08" em data local.
 * (new Date('2026-10-08') usaria o fuso UTC e, no Brasil, viraria o dia 7.)
 */
export function dataLocal(iso: string): Date {
  const [ano = 1970, mes = 1, dia = 1] = iso.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

/** "8 de outubro de 2026" */
export function formatarData(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(dataLocal(iso))
}

/** "08/10/2026" */
export function formatarDataCurta(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(dataLocal(iso))
}
