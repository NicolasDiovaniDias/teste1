<script setup lang="ts">
import { LoaderCircle, TriangleAlert } from '@lucide/vue'
import { computed } from 'vue'
import { empresa } from '@/config'
import type { RespostaCep, RespostaRua } from '@/types/busca'
import type { Bairro } from '@/types/coleta'
import ListaBairros from './ListaBairros.vue'

export type ModoBusca = 'nenhum' | 'cep' | 'rua' | 'bairro'

const props = defineProps<{
  modo: ModoBusca
  carregando: boolean
  erro: string | null
  respostaCep: RespostaCep | null
  respostaRua: RespostaRua | null
  bairrosFiltrados: Bairro[]
  textoBairro: string
  totalBairros: number
  selecionadoId: string | null
}>()
const emit = defineEmits<{ selecionar: [id: string]; verTodos: [] }>()

const titulo = computed(() => {
  if (props.modo === 'cep') return 'Resultado do CEP'
  if (props.modo === 'rua') return 'Resultado da rua'
  if (props.modo === 'bairro') return props.textoBairro.trim() ? 'Locais encontrados' : 'Todos os locais atendidos'
  return 'Resultado'
})

const enderecoCep = computed(() => {
  const e = props.respostaCep?.endereco
  if (!e) return ''
  return [e.logradouro, e.bairro, `${e.cidade}/${e.uf}`].filter(Boolean).join(', ')
})

const botaoLink = 'self-start font-bold text-folha underline underline-offset-4 hover:text-floresta'
</script>

<template>
  <section aria-labelledby="titulo-resultados" class="flex flex-col gap-4 rounded-3xl border border-linha bg-white p-6">
    <h2 id="titulo-resultados" class="font-display text-[22px] font-extrabold">{{ titulo }}</h2>

    <div aria-live="polite" class="flex flex-col gap-4">
      <p v-if="carregando" class="flex items-center gap-2 text-musgo">
        <LoaderCircle class="size-5 animate-spin" aria-hidden="true" />
        Buscando...
      </p>

      <p v-else-if="erro" role="alert" class="rounded-2xl bg-[#fdecea] p-4 font-semibold text-[#7a1e17]">{{ erro }}</p>

      <!-- Antes de qualquer busca -->
      <template v-else-if="modo === 'nenhum'">
        <p class="leading-relaxed text-musgo">Use uma das três buscas acima. O resultado aparece aqui.</p>
        <button type="button" :class="botaoLink" @click="emit('verTodos')">Ver todos os {{ totalBairros }} locais atendidos</button>
      </template>

      <!-- Busca por CEP -->
      <template v-else-if="modo === 'cep' && respostaCep">
        <p class="rounded-2xl bg-areia p-4 leading-relaxed">
          <span class="block text-sm text-musgo">Endereço do CEP {{ respostaCep.endereco.cep }}</span>
          <strong class="font-semibold">{{ enderecoCep }}</strong>
        </p>

        <p v-if="respostaCep.foraDaArea" class="leading-relaxed">
          Esse CEP é de {{ respostaCep.endereco.cidade }}. A coleta seletiva da {{ empresa.nome }} atende {{ empresa.cidade }}.
        </p>

        <template v-else-if="respostaCep.bairros.length">
          <p class="font-semibold">
            {{
              respostaCep.correspondencia === 'aproximada'
                ? 'Encontramos locais com nome parecido. Confira qual é o seu:'
                : respostaCep.bairros.length === 1
                  ? 'Local da coleta para esse endereço:'
                  : 'Locais da coleta para esse endereço:'
            }}
          </p>
          <ListaBairros :bairros="respostaCep.bairros" :selecionado-id="selecionadoId" @selecionar="(id) => emit('selecionar', id)" />
        </template>

        <div v-else class="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-[#c9c5bb] p-4">
          <p class="flex gap-2.5 leading-relaxed">
            <TriangleAlert class="mt-0.5 size-5 shrink-0 text-[#8a6a08]" aria-hidden="true" />
            <span>O bairro “{{ respostaCep.endereco.bairro || 'sem nome' }}” não aparece na lista da coleta seletiva.</span>
          </p>
          <p class="text-musgo">Se o seu bairro é conhecido por outro nome, procure na lista. Se não estiver lá, fale com a equipe.</p>
          <div class="flex flex-wrap gap-x-5 gap-y-2">
            <button type="button" :class="botaoLink" @click="emit('verTodos')">Ver a lista de locais</button>
            <a href="#contato" :class="botaoLink">Falar com a equipe</a>
          </div>
        </div>
      </template>

      <!-- Busca por rua -->
      <template v-else-if="modo === 'rua' && respostaRua">
        <p v-if="respostaRua.servicoIndisponivel" class="rounded-2xl bg-[#fdf4d6] p-4 leading-relaxed text-[#4d3a04]">
          A busca de ruas dos Correios não respondeu agora. Mostramos só os locais da lista com esse nome. Tente pelo CEP ou pelo bairro.
        </p>

        <template v-if="respostaRua.bairros.length">
          <p class="font-semibold">{{ respostaRua.bairros.length === 1 ? 'Local da coleta encontrado:' : 'Locais da coleta encontrados:' }}</p>
          <ListaBairros :bairros="respostaRua.bairros" :selecionado-id="selecionadoId" @selecionar="(id) => emit('selecionar', id)" />
        </template>

        <div v-if="respostaRua.enderecos.length" class="flex flex-col gap-2">
          <p class="text-sm font-bold text-[#34463c]">Ruas com esse nome em {{ empresa.cidade }}</p>
          <ul class="divide-y divide-linha rounded-2xl border border-linha">
            <li
              v-for="endereco in respostaRua.enderecos"
              :key="`${endereco.cep}-${endereco.bairro}`"
              class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3"
            >
              <div class="min-w-0">
                <p class="font-semibold">{{ endereco.logradouro }}</p>
                <p class="text-sm text-musgo">
                  {{ endereco.bairro || 'Bairro não informado' }}, CEP {{ endereco.cep }}{{ endereco.complemento ? ` (${endereco.complemento})` : '' }}
                </p>
              </div>
              <button
                v-if="endereco.bairroIds[0]"
                type="button"
                class="inline-flex min-h-11 items-center rounded-xl border-2 border-[#cfdcd2] px-3.5 text-sm font-bold hover:border-folha"
                @click="emit('selecionar', endereco.bairroIds[0])"
              >
                Ver coleta
              </button>
              <span v-else class="text-sm text-musgo">Bairro fora da lista</span>
            </li>
          </ul>
        </div>

        <p v-if="!respostaRua.bairros.length && !respostaRua.enderecos.length" class="leading-relaxed">
          Não encontramos ruas com esse nome em {{ empresa.cidade }}. Confira a grafia ou tente pelo CEP.
        </p>
      </template>

      <!-- Busca por bairro (ou lista completa) -->
      <template v-else-if="modo === 'bairro'">
        <ListaBairros
          v-if="bairrosFiltrados.length"
          :bairros="bairrosFiltrados"
          :selecionado-id="selecionadoId"
          @selecionar="(id) => emit('selecionar', id)"
        />
        <p v-else class="leading-relaxed">
          Nenhum local encontrado com “{{ textoBairro }}”. Confira a grafia ou
          <a href="#contato" class="font-bold text-folha underline underline-offset-4">fale com a equipe</a>.
        </p>
      </template>
    </div>
  </section>
</template>
