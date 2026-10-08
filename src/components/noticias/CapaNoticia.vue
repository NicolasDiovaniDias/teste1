<script setup lang="ts">
import { computed } from 'vue'
import simbolo from '@/assets/marca/coovir-simbolo.webp'

/*
 * Capa da notícia. Sem imagem, mostra o símbolo da COOVIR sobre uma das cores
 * de fundo da própria logo (a mesma notícia sempre recebe a mesma cor).
 */
const props = defineProps<{ imagem?: string; descricao?: string; chave: string }>()

const TONS = ['#fff3ad', '#ffcbbd', '#acd9b7', '#ade3f1']

const tom = computed(() => {
  let soma = 0
  for (const letra of props.chave) soma += letra.charCodeAt(0)
  return TONS[soma % TONS.length]
})
</script>

<template>
  <div class="overflow-hidden bg-[#e7eee8]" :style="imagem ? undefined : { backgroundColor: tom }">
    <img v-if="imagem" :src="imagem" :alt="descricao ?? ''" loading="lazy" class="size-full object-cover" />
    <div v-else class="flex size-full items-center justify-center">
      <img :src="simbolo" alt="" class="aspect-square w-1/4 max-w-28 min-w-12" />
    </div>
  </div>
</template>
