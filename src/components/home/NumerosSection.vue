<script setup lang="ts">
import { numeros } from '@/config'
</script>

<template>
  <section aria-label="Números da coleta" class="px-6">
    <dl
      class="mx-auto -mt-16 flex max-w-6xl flex-wrap gap-6 rounded-3xl bg-white p-8 shadow-[0_12px_32px_rgba(15,59,42,0.10)]"
    >
      <div v-for="item in numeros" :key="item.rotulo" class="flex flex-[1_1_220px] flex-col-reverse gap-1.5 px-3 py-2">
        <dt class="text-[15px] text-musgo">{{ item.rotulo }}</dt>
        <dd class="font-display text-[44px] leading-none font-extrabold text-floresta">{{ item.valor }}</dd>
      </div>
    </dl>
  </section>
</template>
