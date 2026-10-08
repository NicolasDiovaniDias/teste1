<script setup lang="ts">
import { LoaderCircle, LocateFixed } from '@lucide/vue'
import { computed, defineAsyncComponent, nextTick, onMounted, ref, watch } from 'vue'
import type { LocationQueryRaw } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import CaixasDeBusca from '@/components/consulta/CaixasDeBusca.vue'
import ResultadoColeta from '@/components/consulta/ResultadoColeta.vue'
import ResultadosDaBusca from '@/components/consulta/ResultadosDaBusca.vue'
import type { ModoBusca } from '@/components/consulta/ResultadosDaBusca.vue'
import { useLocalizacao } from '@/composables/useLocalizacao'
import { bairroNoPonto } from '@/lib/geo'
import { buscarPorCep, buscarPorRua } from '@/services/buscaApi'
import { mensagemDeErro } from '@/services/http'
import { useBairrosStore } from '@/stores/bairros'
import type { RespostaCep, RespostaRua } from '@/types/busca'

// O mapa (e o Leaflet, que é pesado) só é baixado quando algum bairro tiver área para mostrar
const MapaBairros = defineAsyncComponent(() => import('@/components/consulta/MapaBairros.vue'))

const store = useBairrosStore()
const route = useRoute()
const router = useRouter()
const { buscando: localizando, erro: erroLocalizacao, localizar } = useLocalizacao()

// O que está escrito em cada uma das três caixas
const cep = ref('')
const rua = ref('')
const bairro = ref('')

// Qual busca foi feita por último e o que ela trouxe
const modo = ref<ModoBusca>('nenhum')
const buscando = ref<'cep' | 'rua' | null>(null)
const erroBusca = ref<string | null>(null)
const respostaCep = ref<RespostaCep | null>(null)
const respostaRua = ref<RespostaRua | null>(null)

// O local escolhido fica na URL (/consulta?bairro=centro): dá para compartilhar o link
const selecionadoId = computed(() => (typeof route.query.bairro === 'string' ? route.query.bairro : null))
const selecionado = computed(() => (selecionadoId.value ? (store.porId(selecionadoId.value) ?? null) : null))
const bairrosFiltrados = computed(() => store.buscar(bairro.value))
// O mapa só aparece quando algum bairro tiver a área cadastrada
const temMapa = computed(() => store.bairros.some((b) => b.area))

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function selecionar(id: string, rolar = true) {
  router.replace({ query: { ...route.query, bairro: id } })
  // No celular o resultado fica embaixo da lista: leva a pessoa até ele
  if (rolar) {
    nextTick(() =>
      document.getElementById('resultado-coleta')?.scrollIntoView({ block: 'nearest', behavior: semAnimacao ? 'auto' : 'smooth' }),
    )
  }
}

// Descobre o bairro pelo GPS do celular, comparando com as áreas cadastradas
async function usarLocalizacao() {
  const ponto = await localizar()
  if (!ponto) return
  const encontrado = bairroNoPonto(store.bairros, ponto.lat, ponto.lng)
  if (encontrado) selecionar(encontrado.id)
  else erroLocalizacao.value = 'Não encontramos um local da coleta onde você está. Busque pelo CEP, pela rua ou pelo bairro.'
}

function mostrarTodos() {
  modo.value = 'bairro'
  bairro.value = ''
  erroBusca.value = null
}

// Digitar na caixa de bairro mostra a lista filtrada
watch(bairro, (texto) => {
  if (!texto.trim()) return
  modo.value = 'bairro'
  erroBusca.value = null
})

async function buscarCep() {
  const numeros = cep.value.replace(/\D/g, '')
  modo.value = 'cep'
  erroBusca.value = null
  respostaCep.value = null
  if (numeros.length !== 8) {
    erroBusca.value = 'Digite os 8 números do CEP.'
    return
  }
  buscando.value = 'cep'
  try {
    const resposta = await buscarPorCep(numeros)
    respostaCep.value = resposta
    const query: LocationQueryRaw = { cep: numeros }
    // Um só local encontrado: já mostra a coleta dele
    if (resposta.bairros.length === 1 && resposta.bairros[0]) query.bairro = resposta.bairros[0].id
    router.replace({ query })
  } catch (e) {
    erroBusca.value = mensagemDeErro(e)
  } finally {
    buscando.value = null
  }
}

async function buscarRua() {
  const texto = rua.value.trim()
  modo.value = 'rua'
  erroBusca.value = null
  respostaRua.value = null
  if (texto.replace(/\s/g, '').length < 3) {
    erroBusca.value = 'Digite pelo menos 3 letras do nome da rua.'
    return
  }
  buscando.value = 'rua'
  try {
    const resposta = await buscarPorRua(texto)
    respostaRua.value = resposta
    const query: LocationQueryRaw = { rua: texto }
    if (resposta.bairros.length === 1 && resposta.bairros[0]) query.bairro = resposta.bairros[0].id
    router.replace({ query })
  } catch (e) {
    erroBusca.value = mensagemDeErro(e)
  } finally {
    buscando.value = null
  }
}

onMounted(async () => {
  await store.carregar()
  // A busca pode vir da home (?cep= ou ?busca=) ou de um link compartilhado (?rua=)
  const { cep: cepUrl, rua: ruaUrl, busca } = route.query
  if (typeof cepUrl === 'string') {
    cep.value = cepUrl.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2')
    await buscarCep()
  } else if (typeof ruaUrl === 'string') {
    rua.value = ruaUrl
    await buscarRua()
  } else if (typeof busca === 'string') {
    bairro.value = busca
    modo.value = 'bairro'
    const [unico, ...outros] = store.buscar(busca)
    if (unico && outros.length === 0 && !selecionadoId.value) selecionar(unico.id, false)
  }
})
</script>

<template>
  <section class="bg-floresta px-6 pt-8 pb-14 text-white">
    <div class="mx-auto flex max-w-6xl flex-col gap-3.5">
      <nav aria-label="Você está em" class="flex flex-wrap items-center gap-2 text-sm text-[#cfe0d5]">
        <RouterLink :to="{ name: 'inicio' }" class="underline underline-offset-4">Início</RouterLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Consultar coleta</span>
      </nav>
      <h1 class="font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.04] font-extrabold tracking-tight">
        Quando a coleta passa <span class="text-broto">NA SUA RUA?</span>
      </h1>
      <p class="max-w-2xl text-lg leading-relaxed text-nevoa">
        Busque pelo CEP, pelo nome da rua ou pelo bairro para ver os dias e turnos da coleta seletiva.
      </p>
    </div>
  </section>

  <div class="px-6 pt-10 pb-20">
    <div class="mx-auto flex max-w-6xl flex-col gap-7">
      <CaixasDeBusca
        v-model:cep="cep"
        v-model:rua="rua"
        v-model:bairro="bairro"
        :buscando="buscando"
        @buscar-cep="buscarCep"
        @buscar-rua="buscarRua"
      />

      <p v-if="store.erro" role="alert" class="rounded-2xl bg-[#fdecea] p-4 font-semibold text-[#7a1e17]">
        {{ store.erro }}
        <button type="button" class="ml-1 underline underline-offset-4" @click="store.carregar(true)">Tentar de novo</button>
      </p>

      <div class="flex flex-wrap items-start gap-7">
        <ResultadosDaBusca
          class="min-w-0 flex-[1_1_400px]"
          :modo="modo"
          :carregando="buscando !== null"
          :erro="erroBusca"
          :resposta-cep="respostaCep"
          :resposta-rua="respostaRua"
          :bairros-filtrados="bairrosFiltrados"
          :texto-bairro="bairro"
          :total-bairros="store.bairros.length"
          :selecionado-id="selecionadoId"
          @selecionar="(id) => selecionar(id)"
          @ver-todos="mostrarTodos"
        />
        <div id="resultado-coleta" class="min-w-0 flex-[1.15_1_440px] scroll-mt-4" aria-live="polite">
          <div v-if="!store.carregou && !store.erro" class="h-64 animate-pulse rounded-3xl bg-white" aria-label="Carregando bairros" />
          <ResultadoColeta v-else :bairro="selecionado" />
        </div>
      </div>

      <div v-if="temMapa" class="flex min-w-0 flex-col gap-4 rounded-3xl border border-linha bg-white p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="font-display text-[22px] font-extrabold">Mapa dos bairros</h2>
          <ul class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#34463c]">
            <li class="flex items-center gap-2"><span class="size-4 rounded-[5px] bg-floresta" aria-hidden="true" />Selecionado</li>
            <li class="flex items-center gap-2"><span class="size-4 rounded-[5px] bg-[#a7d3b5]" aria-hidden="true" />Com coleta seletiva</li>
            <li class="flex items-center gap-2">
              <span class="size-4 rounded-[5px] border border-dashed border-[#a39e92] bg-[#e9e7e1]" aria-hidden="true" />Sem coleta
            </li>
          </ul>
        </div>
        <div class="flex flex-col gap-1">
          <button
            type="button"
            class="-ml-3 inline-flex min-h-11 items-center gap-2 self-start rounded-xl px-3 font-bold text-folha hover:bg-accent disabled:opacity-60"
            :disabled="localizando"
            @click="usarLocalizacao"
          >
            <LoaderCircle v-if="localizando" class="size-[18px] animate-spin" aria-hidden="true" />
            <LocateFixed v-else class="size-[18px]" aria-hidden="true" />
            {{ localizando ? 'Procurando sua localização...' : 'Usar minha localização' }}
          </button>
          <p v-if="erroLocalizacao" role="status" class="text-sm text-[#7a1e17]">{{ erroLocalizacao }}</p>
        </div>
        <MapaBairros :bairros="store.bairros" :selecionado-id="selecionadoId" @selecionar="(id) => selecionar(id)" />
      </div>
    </div>
  </div>
</template>
