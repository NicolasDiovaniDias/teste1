<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import type { Bairro } from '@/types/coleta'

defineProps<{ bairros: Bairro[]; selecionadoId: string | null }>()
const emit = defineEmits<{ selecionar: [id: string] }>()
const busca = defineModel<string>({ required: true })
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2.5">
      <label for="busca-bairro" class="font-bold">Seu bairro</label>
      <div
        class="flex min-h-14 items-center gap-2.5 rounded-2xl border-2 border-input bg-white pr-2 pl-4 text-musgo focus-within:border-folha"
      >
        <Search class="size-5 shrink-0" aria-hidden="true" />
        <input
          id="busca-bairro"
          v-model="busca"
          type="text"
          autocomplete="off"
          placeholder="Ex.: Centro"
          aria-describedby="dica-busca"
          class="w-full min-w-0 bg-transparent py-3.5 text-[17px] text-tinta outline-none placeholder:text-musgo"
        />
        <button
          v-if="busca"
          type="button"
          class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f3ef] text-[#34463c] hover:bg-accent"
          @click="busca = ''"
        >
          <X class="size-[18px]" aria-hidden="true" />
          <span class="sr-only">Limpar busca</span>
        </button>
      </div>
      <p id="dica-busca" class="text-sm text-musgo">Pode digitar sem acento. Depois toque no seu bairro na lista.</p>
    </div>

    <div class="flex flex-col gap-3">
      <h2 class="text-sm font-bold text-[#34463c]">Bairros</h2>
      <ul v-if="bairros.length" class="flex flex-wrap gap-2">
        <li v-for="bairro in bairros" :key="bairro.id">
          <button
            type="button"
            :aria-pressed="bairro.id === selecionadoId"
            :class="[
              'inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 px-4 text-[15px] font-bold transition-colors',
              bairro.id === selecionadoId
                ? 'border-floresta bg-floresta text-white'
                : bairro.ativo
                  ? 'border-[#cfdcd2] bg-white text-tinta hover:border-folha'
                  : 'border-dashed border-[#b9b4a9] bg-white text-[#4a5550] hover:border-musgo',
            ]"
            @click="emit('selecionar', bairro.id)"
          >
            {{ bairro.nome }}
            <span v-if="!bairro.ativo" class="text-[13px] font-semibold">(sem coleta)</span>
          </button>
        </li>
      </ul>
      <p v-else class="leading-relaxed text-musgo">
        Nenhum bairro encontrado com “{{ busca }}”. Confira a grafia ou
        <a href="#contato" class="font-bold text-folha underline underline-offset-4">fale com a equipe</a>.
      </p>
    </div>
  </div>
</template>
