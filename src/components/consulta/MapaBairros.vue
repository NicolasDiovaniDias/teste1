<script setup lang="ts">
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { useResizeObserver } from '@vueuse/core'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { mapa as configMapa } from '@/config'
import type { Bairro } from '@/types/coleta'

/*
 * Mapa feito com Leaflet "puro" (sem biblioteca extra para Vue).
 * O Leaflet mexe direto no HTML, então guardamos o mapa numa variável comum
 * (não reativa) e só pedimos para ele se redesenhar quando os dados mudam.
 */
const props = defineProps<{ bairros: Bairro[]; selecionadoId: string | null }>()
const emit = defineEmits<{ selecionar: [id: string] }>()

type FeatureBairro = Feature<Polygon | MultiPolygon, { id: string }>
type CamadaBairro = L.Polygon & { feature?: FeatureBairro }

const container = useTemplateRef<HTMLDivElement>('container')
let mapa: L.Map | null = null
let camada: L.GeoJSON | null = null

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const opacidade = configMapa.mostrarRuas ? 0.55 : 0.92

function porId(id: string | undefined) {
  return props.bairros.find((b) => b.id === id)
}

function estilo(bairro: Bairro): L.PathOptions {
  const selecionado = bairro.id === props.selecionadoId
  if (selecionado) return { color: '#ffffff', weight: 3, fillColor: '#0f3b2a', fillOpacity: opacidade, dashArray: undefined }
  if (bairro.ativo) return { color: '#ffffff', weight: 2, fillColor: '#a7d3b5', fillOpacity: opacidade, dashArray: undefined }
  return { color: '#a39e92', weight: 1.5, fillColor: '#e9e7e1', fillOpacity: opacidade, dashArray: '6 4' }
}

/** Monta o rótulo com textContent (e não innerHTML) para o nome digitado no painel nunca virar código. */
function criarRotulo(bairro: Bairro): HTMLElement {
  const rotulo = document.createElement('span')
  rotulo.textContent = bairro.nome
  if (!bairro.ativo) {
    const detalhe = document.createElement('small')
    detalhe.textContent = 'sem coleta'
    detalhe.style.display = 'block'
    detalhe.style.fontWeight = '600'
    rotulo.append(detalhe)
  }
  return rotulo
}

function atualizarEstilos() {
  camada?.eachLayer((layer) => {
    const poligono = layer as CamadaBairro
    const bairro = porId(poligono.feature?.properties.id)
    if (!bairro) return
    const selecionado = bairro.id === props.selecionadoId
    poligono.setStyle(estilo(bairro))
    if (selecionado) poligono.bringToFront()
    const elemento = poligono.getTooltip()?.getElement()
    elemento?.classList.toggle('rotulo-bairro--ativo', selecionado)
    elemento?.classList.toggle('rotulo-bairro--sem-coleta', !bairro.ativo && !selecionado)
  })
}

function montarCamada() {
  if (!mapa) return
  camada?.remove()

  const colecao: FeatureCollection<Polygon | MultiPolygon, { id: string }> = {
    type: 'FeatureCollection',
    features: props.bairros.flatMap((b) =>
      b.area ? [{ type: 'Feature' as const, properties: { id: b.id }, geometry: b.area }] : [],
    ),
  }

  camada = L.geoJSON(colecao, {
    onEachFeature: (feature, layer) => {
      const bairro = porId((feature as FeatureBairro).properties.id)
      if (!bairro) return
      layer.on('click', () => emit('selecionar', bairro.id))
      layer.bindTooltip(criarRotulo(bairro), { permanent: true, direction: 'center', className: 'rotulo-bairro' })
    },
  }).addTo(mapa)

  atualizarEstilos()
}

function enquadrarTudo() {
  if (!mapa) return
  if (camada && camada.getLayers().length > 0) mapa.fitBounds(camada.getBounds(), { padding: [16, 16] })
  else mapa.setView([-15.8, -47.9], 4) // sem áreas cadastradas: mostra o Brasil
}

/** Se o bairro escolhido estiver fora da tela, move o mapa até ele. */
function mostrarSelecionado() {
  if (!mapa || !camada || !props.selecionadoId) return
  camada.eachLayer((layer) => {
    const poligono = layer as CamadaBairro
    if (poligono.feature?.properties.id !== props.selecionadoId) return
    const limites = poligono.getBounds()
    if (!mapa!.getBounds().contains(limites)) {
      mapa!.flyToBounds(limites, { padding: [40, 40], maxZoom: 15, animate: !semAnimacao })
    }
  })
}

onMounted(() => {
  if (!container.value) return
  mapa = L.map(container.value, {
    scrollWheelZoom: false, // não "rouba" a rolagem da página no computador
    zoomSnap: 0.25,
    attributionControl: configMapa.mostrarRuas,
  })
  if (configMapa.mostrarRuas) {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa)
  }
  montarCamada()
  enquadrarTudo()
  mostrarSelecionado()
})

useResizeObserver(container, () => mapa?.invalidateSize())

watch(
  () => props.bairros,
  () => {
    montarCamada()
    enquadrarTudo()
  },
  { deep: true },
)

watch(
  () => props.selecionadoId,
  () => {
    atualizarEstilos()
    mostrarSelecionado()
  },
)

onBeforeUnmount(() => {
  mapa?.remove()
  mapa = null
})
</script>

<template>
  <div
    ref="container"
    role="region"
    aria-label="Mapa dos bairros. Também dá para escolher o bairro pela lista."
    class="mapa-bairros h-[300px] w-full rounded-[18px] sm:h-[440px]"
  />
</template>
