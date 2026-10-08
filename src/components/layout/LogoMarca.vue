<script setup lang="ts">
import simbolo from '@/assets/marca/coovir-simbolo.webp'
import { empresa } from '@/config'

withDefaults(defineProps<{ tamanho?: number }>(), { tamanho: 44 })
</script>

<template>
  <span class="flex items-center gap-3">
    <!-- O nome ao lado já identifica a marca, por isso a imagem fica com alt vazio -->
    <img :src="simbolo" :width="tamanho" :height="tamanho" alt="" class="shrink-0" />
    <span class="font-display text-[22px] leading-none font-extrabold tracking-tight">{{ empresa.nome }}</span>
  </span>
</template>
