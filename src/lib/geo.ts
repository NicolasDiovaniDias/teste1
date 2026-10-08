import type { Position } from 'geojson'
import type { Bairro } from '@/types/coleta'

/** Testa se um ponto está dentro de um anel do polígono (algoritmo "ray casting"). */
function dentroDoAnel(lng: number, lat: number, anel: Position[]): boolean {
  let dentro = false
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const [xi = 0, yi = 0] = anel[i] ?? []
    const [xj = 0, yj = 0] = anel[j] ?? []
    const cruza = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    if (cruza) dentro = !dentro
  }
  return dentro
}

/** O primeiro anel é o contorno; os outros são "buracos" dentro dele. */
function dentroDoPoligono(lng: number, lat: number, aneis: Position[][]): boolean {
  const [contorno, ...buracos] = aneis
  if (!contorno || !dentroDoAnel(lng, lat, contorno)) return false
  return !buracos.some((buraco) => dentroDoAnel(lng, lat, buraco))
}

/** Descobre em qual bairro está um ponto (latitude/longitude do GPS do celular). */
export function bairroNoPonto(bairros: Bairro[], lat: number, lng: number): Bairro | undefined {
  return bairros.find((bairro) => {
    if (!bairro.area) return false
    if (bairro.area.type === 'Polygon') return dentroDoPoligono(lng, lat, bairro.area.coordinates)
    return bairro.area.coordinates.some((poligono) => dentroDoPoligono(lng, lat, poligono))
  })
}
