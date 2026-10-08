<script setup lang="ts">
import { LoaderCircle, LocateFixed } from '@lucide/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BuscaBairro from '@/components/consulta/BuscaBairro.vue'
import MapaBairros from '@/components/consulta/MapaBairros.vue'
import ResultadoColeta from '@/components/consulta/ResultadoColeta.vue'
import { useLocalizacao } from '@/composables/useLocalizacao'
import { bairroNoPonto } from '@/lib/geo'
import { useBairrosStore } from '@/stores/bairros'

const store = useBairrosStore()
const route = useRoute()
const router = useRouter()
const { buscando, erro: erroLocalizacao, localizar } = useLocalizacao()

// A busca pode vir da home: /consulta?busca=centro
const busca = ref(typeof route.query.busca === 'string' ? route.query.busca : '')

// O bairro escolhido fica na URL (/consulta?bairro=centro), assim dá para compartilhar o link
const selecionadoId = computed(() => (typeof route.query.bairro === 'string' ? route.query.bairro : null))
const selecionado = computed(() => (selecionadoId.value ? (store.porId(selecionadoId.value) ?? null) : null))
const encontrados = computed(() => store.buscar(busca.value))

function selecionar(id: string) {
  router.replace({ query: { ...route.query, bairro: id } })
}

async function usarLocalizacao() {
  const ponto = await localizar()
  if (!ponto) return
  const bairro = bairroNoPonto(store.bairros, ponto.lat, ponto.lng)
  if (bairro) selecionar(bairro.id)
  else erroLocalizacao.value = 'Não encontramos um bairro cadastrado na sua localização. Escolha pela lista.'
}

onMounted(async () => {
  await store.carregar()
  // Se a busca da home bate com um bairro só, já mostra o resultado
  if (!selecionadoId.value && busca.value) {
    const [unico, ...outros] = store.buscar(busca.value)
    if (unico && outros.length === 0) selecionar(unico.id)
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
        Quando a coleta passa <span class="text-broto">NO SEU BAIRRO?</span>
      </h1>
      <p class="max-w-2xl text-lg leading-relaxed text-nevoa">
        Digite o nome do bairro ou toque nele no mapa para ver os dias e turnos da coleta seletiva.
      </p>
    </div>
  </section>

  <div class="px-6 pt-10 pb-20">
    <div class="mx-auto flex max-w-6xl flex-wrap items-start gap-7">
      <div class="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
        <BuscaBairro v-model="busca" :bairros="encontrados" :selecionado-id="selecionadoId" @selecionar="selecionar" />

        <div class="-mt-2 flex flex-col gap-1">
          <button
            type="button"
            class="-ml-3 inline-flex min-h-11 items-center gap-2 self-start rounded-xl px-3 font-bold text-folha hover:bg-accent disabled:opacity-60"
            :disabled="buscando"
            @click="usarLocalizacao"
          >
            <LoaderCircle v-if="buscando" class="size-[18px] animate-spin" aria-hidden="true" />
            <LocateFixed v-else class="size-[18px]" aria-hidden="true" />
            {{ buscando ? 'Procurando sua localização...' : 'Usar minha localização' }}
          </button>
          <p v-if="erroLocalizacao" role="status" class="text-sm text-[#7a1e17]">{{ erroLocalizacao }}</p>
        </div>

        <p v-if="store.erro" role="alert" class="rounded-2xl bg-[#fdecea] p-4 font-semibold text-[#7a1e17]">
          {{ store.erro }}
          <button type="button" class="ml-1 underline underline-offset-4" @click="store.carregar(true)">Tentar de novo</button>
        </p>

        <div aria-live="polite">
          <div v-if="store.carregando" class="h-64 animate-pulse rounded-3xl bg-white" aria-label="Carregando bairros" />
          <ResultadoColeta v-else :bairro="selecionado" />
        </div>
      </div>

      <div class="flex min-w-0 flex-[1.25_1_520px] flex-col gap-4 rounded-3xl border border-linha bg-white p-5">
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
        <MapaBairros :bairros="store.bairros" :selecionado-id="selecionadoId" @selecionar="selecionar" />
        <p class="text-sm text-musgo">Toque em um bairro no mapa para ver os dias de coleta.</p>
      </div>
    </div>
  </div>
</template>
