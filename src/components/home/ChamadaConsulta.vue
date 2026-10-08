<script setup lang="ts">
import { MapPin } from '@lucide/vue'
import { empresa } from '@/config'
</script>

<template>
  <section aria-labelledby="titulo-chamada" class="px-6 pb-24">
    <div
      class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 rounded-[32px] bg-broto px-8 py-14 text-floresta sm:px-12 sm:py-16"
    >
      <h2
        id="titulo-chamada"
        class="min-w-0 flex-[1_1_520px] font-display text-[clamp(2rem,3.8vw,3.4rem)] leading-[1.04] font-extrabold tracking-tight text-balance"
      >
        Separou? Agora só falta saber
        <span class="underline decoration-[6px] underline-offset-8">QUANDO A COLETA PASSA.</span>
      </h2>
      <div class="flex flex-wrap gap-3">
        <RouterLink
          :to="{ name: 'consulta' }"
          class="inline-flex min-h-14 items-center gap-2.5 rounded-full bg-floresta px-7 text-[17px] font-bold text-white hover:bg-[#164d38]"
        >
          <MapPin class="size-5" aria-hidden="true" />
          Consultar meu bairro
        </RouterLink>
        <a
          :href="empresa.whatsappLink || '#contato'"
          class="inline-flex min-h-14 items-center rounded-full border-2 border-floresta px-7 text-[17px] font-bold hover:bg-floresta/10"
        >
          Falar com a equipe
        </a>
      </div>
    </div>
  </section>
</template>
