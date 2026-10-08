<script setup lang="ts">
import { CircleCheck, Clock, MapPin, TriangleAlert, Truck } from '@lucide/vue'
import { computed } from 'vue'
import { DIAS, ORDEM_DIAS, PERIODOS, descreverHorario, descreverProximaColeta, ordenarTurnos, proximaColeta } from '@/lib/coleta'
import type { Bairro } from '@/types/coleta'

const props = defineProps<{ bairro: Bairro | null }>()

const turnos = computed(() => (props.bairro ? ordenarTurnos(props.bairro.turnos) : []))

const proxima = computed(() => {
  if (!props.bairro) return null
  const resultado = proximaColeta(props.bairro)
  return resultado ? descreverProximaColeta(resultado) : null
})

const semana = computed(() =>
  ORDEM_DIAS.map((dia) => ({
    dia,
    temColeta: turnos.value.some((t) => t.dia === dia),
  })),
)
</script>

<template>
  <!-- Nenhum bairro escolhido ainda -->
  <div
    v-if="!bairro"
    class="flex flex-col items-start gap-2.5 rounded-3xl border-2 border-dashed border-[#cfdcd2] p-8 text-musgo"
  >
    <MapPin class="size-7" aria-hidden="true" />
    <p class="text-lg font-bold text-tinta">Escolha um local para ver a coleta</p>
    <p>Busque pelo CEP, pela rua ou pelo bairro e toque no seu local na lista.</p>
  </div>

  <!-- Bairro sem coleta seletiva -->
  <article
    v-else-if="!bairro.ativo || turnos.length === 0"
    class="flex flex-col gap-4 rounded-3xl border-2 border-dashed border-[#c9c5bb] bg-white p-7"
  >
    <span class="flex size-13 items-center justify-center rounded-2xl bg-[#fdf4d6] text-[#6b5106]">
      <TriangleAlert class="size-6.5" aria-hidden="true" />
    </span>
    <h2 class="font-display text-[28px] leading-tight font-extrabold">Ainda não há coleta seletiva em {{ bairro.nome }}</h2>
    <p class="leading-relaxed text-musgo">
      Enquanto a coleta não chega ao seu bairro, leve os recicláveis limpos a um [PONTO DE ENTREGA VOLUNTÁRIA] ou peça a
      inclusão do seu bairro para a nossa equipe.
    </p>
    <a
      href="#contato"
      class="inline-flex min-h-12 items-center self-start rounded-full bg-floresta px-6 font-bold text-white hover:bg-[#164d38]"
    >
      Pedir coleta no meu bairro
    </a>
  </article>

  <!-- Bairro com coleta -->
  <article v-else class="flex flex-col gap-6 rounded-3xl border border-linha bg-white p-7">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="flex flex-col gap-1">
        <span class="text-sm font-semibold text-musgo">Coleta seletiva em</span>
        <h2 class="font-display text-[34px] leading-none font-extrabold tracking-tight">{{ bairro.nome }}</h2>
      </div>
      <span class="inline-flex items-center gap-1.5 rounded-full bg-[#e3f2e7] px-3 py-1.5 text-[13px] font-bold text-[#14532d]">
        <CircleCheck class="size-3.5" aria-hidden="true" />
        Coleta ativa
      </span>
    </div>

    <div v-if="proxima" class="flex items-center gap-3.5 rounded-2xl bg-broto px-5 py-4 text-floresta">
      <Truck class="size-7 shrink-0" aria-hidden="true" />
      <div class="flex flex-col">
        <span class="text-sm font-bold">Próxima coleta</span>
        <span class="font-display text-[22px] leading-tight font-extrabold">{{ proxima.titulo }}</span>
        <span class="text-[15px] font-semibold">{{ proxima.detalhe }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-2.5">
      <h3 class="text-sm font-bold text-[#34463c]">Dias com coleta</h3>
      <ul class="flex gap-1.5">
        <li
          v-for="item in semana"
          :key="item.dia"
          :class="[
            'flex-1 rounded-xl border py-3 text-center text-sm font-bold',
            item.temColeta ? 'border-floresta bg-floresta text-white' : 'border-linha bg-areia text-[#5b6b62]',
          ]"
        >
          <span aria-hidden="true">{{ DIAS[item.dia].curto }}</span>
          <span class="sr-only">{{ DIAS[item.dia].nome }}: {{ item.temColeta ? 'tem coleta' : 'sem coleta' }}</span>
        </li>
      </ul>
    </div>

    <div class="flex flex-col gap-2.5">
      <h3 class="text-sm font-bold text-[#34463c]">Turnos</h3>
      <ul class="flex flex-col gap-2">
        <li
          v-for="(turno, indice) in turnos"
          :key="indice"
          class="flex flex-wrap items-center gap-x-3.5 gap-y-2 rounded-2xl bg-areia px-4 py-3.5"
        >
          <Clock class="size-5 shrink-0 text-folha" aria-hidden="true" />
          <strong class="font-bold">{{ DIAS[turno.dia].nome }}</strong>
          <span class="rounded-full border border-linha bg-white px-2.5 py-1 text-[13px] font-bold">{{ PERIODOS[turno.periodo].nome }}</span>
          <span v-if="descreverHorario(turno)" class="text-[15px] text-musgo">{{ descreverHorario(turno) }}</span>
        </li>
      </ul>
    </div>

    <p class="text-[15px] leading-relaxed text-musgo">
      Coloque o reciclável na calçada pouco antes do início do turno, em sacos bem fechados.
      <RouterLink :to="{ name: 'inicio', hash: '#o-que-separar' }" class="font-bold text-folha underline underline-offset-4"
        >Veja o que pode ir na coleta</RouterLink
      >.
    </p>
  </article>
</template>
