<script setup lang="ts">
defineProps<{ rotulo: string; id?: string }>()
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-3.5">
    <p class="text-sm font-bold text-folha">{{ rotulo }}</p>
    <h2 :id="id" class="font-display text-[clamp(2rem,3.4vw,3.1rem)] leading-[1.08] font-extrabold tracking-tight text-balance">
      <slot />
    </h2>
    <p v-if="$slots.descricao" class="text-lg leading-relaxed text-musgo">
      <slot name="descricao" />
    </p>
  </div>
</template>
