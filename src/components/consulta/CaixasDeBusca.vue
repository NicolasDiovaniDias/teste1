<script setup lang="ts">
import { LoaderCircle, Search } from '@lucide/vue'
import { empresa } from '@/config'

defineProps<{ buscando: 'cep' | 'rua' | null }>()
const emit = defineEmits<{ buscarCep: []; buscarRua: [] }>()

const cep = defineModel<string>('cep', { required: true })
const rua = defineModel<string>('rua', { required: true })
const bairro = defineModel<string>('bairro', { required: true })

/** Deixa o CEP no formato 00000-000 enquanto a pessoa digita */
function formatarCep(evento: Event) {
  const campo = evento.target as HTMLInputElement
  const numeros = campo.value.replace(/\D/g, '').slice(0, 8)
  cep.value = numeros.length > 5 ? `${numeros.slice(0, 5)}-${numeros.slice(5)}` : numeros
  campo.value = cep.value // tira na hora letras que o Vue não "veria" mudar
}

const caixa = 'flex min-w-0 flex-col gap-3 rounded-3xl border border-linha bg-white p-5 sm:p-6'
const rotulo = 'font-display text-xl font-extrabold'
const campo =
  'h-12 w-full min-w-0 rounded-xl border-2 border-input bg-white px-3.5 text-base text-tinta outline-none placeholder:text-musgo focus:border-folha'
const botao =
  'inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-floresta px-4 font-bold text-white hover:bg-[#164d38] disabled:opacity-70'
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-3">
    <form role="search" aria-label="Buscar pelo CEP" :class="caixa" @submit.prevent="emit('buscarCep')">
      <label for="busca-cep" :class="rotulo">Pelo CEP</label>
      <div class="flex gap-2">
        <input
          id="busca-cep"
          :value="cep"
          type="text"
          inputmode="numeric"
          autocomplete="postal-code"
          placeholder="00000-000"
          maxlength="9"
          aria-describedby="dica-cep"
          :class="campo"
          @input="formatarCep"
        />
        <button type="submit" :class="botao" :disabled="buscando === 'cep'">
          <LoaderCircle v-if="buscando === 'cep'" class="size-5 animate-spin" aria-hidden="true" />
          <Search v-else class="size-5" aria-hidden="true" />
          <span>Buscar</span>
        </button>
      </div>
      <p id="dica-cep" class="text-sm text-musgo">Os 8 números do CEP da sua casa.</p>
    </form>

    <form role="search" aria-label="Buscar pela rua" :class="caixa" @submit.prevent="emit('buscarRua')">
      <label for="busca-rua" :class="rotulo">Pela rua</label>
      <div class="flex gap-2">
        <input
          id="busca-rua"
          v-model="rua"
          type="text"
          autocomplete="off"
          placeholder="Ex.: Senador Salgado Filho"
          aria-describedby="dica-rua"
          :class="campo"
        />
        <button type="submit" :class="botao" :disabled="buscando === 'rua'">
          <LoaderCircle v-if="buscando === 'rua'" class="size-5 animate-spin" aria-hidden="true" />
          <Search v-else class="size-5" aria-hidden="true" />
          <span>Buscar</span>
        </button>
      </div>
      <p id="dica-rua" class="text-sm text-musgo">Pelo menos 3 letras. Só ruas de {{ empresa.cidade }}.</p>
    </form>

    <div role="search" aria-label="Buscar pelo bairro" :class="caixa">
      <label for="busca-bairro" :class="rotulo">Pelo bairro</label>
      <input
        id="busca-bairro"
        v-model="bairro"
        type="text"
        autocomplete="off"
        placeholder="Ex.: Centro"
        aria-describedby="dica-bairro"
        :class="campo"
      />
      <p id="dica-bairro" class="text-sm text-musgo">A lista de locais filtra enquanto você digita.</p>
    </div>
  </div>
</template>
