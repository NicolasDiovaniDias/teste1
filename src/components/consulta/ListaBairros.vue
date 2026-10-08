<script setup lang="ts">
import type { Bairro } from '@/types/coleta'

defineProps<{ bairros: Bairro[]; selecionadoId: string | null }>()
const emit = defineEmits<{ selecionar: [id: string] }>()
</script>

<template>
  <ul class="flex flex-wrap gap-2">
    <li v-for="bairro in bairros" :key="bairro.id">
      <button
        type="button"
        :aria-pressed="bairro.id === selecionadoId"
        :class="[
          'inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 px-4 text-left text-[15px] font-bold transition-colors',
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
</template>
