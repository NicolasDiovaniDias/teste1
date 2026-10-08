<script setup lang="ts">
import { computed, onMounted } from 'vue'
import NoticiaCard from '@/components/noticias/NoticiaCard.vue'
import { empresa } from '@/config'
import { useNoticiasStore } from '@/stores/noticias'

const store = useNoticiasStore()
onMounted(() => store.carregar())

// A mais recente ganha destaque; as duas seguintes ficam ao lado
const destaque = computed(() => store.publicadas[0])
const outras = computed(() => store.publicadas.slice(1, 3))
</script>

<template>
  <section v-if="destaque" id="noticias" aria-labelledby="titulo-noticias" class="scroll-mt-4 bg-white px-6 py-24">
    <div class="mx-auto flex max-w-6xl flex-col gap-12">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="flex max-w-3xl flex-col gap-3.5">
          <p class="text-sm font-bold text-folha">Notícias</p>
          <h2 id="titulo-noticias" class="font-display text-[clamp(2rem,3.4vw,3.1rem)] leading-[1.08] font-extrabold tracking-tight">
            Novidades da {{ empresa.nome }}
          </h2>
        </div>
        <RouterLink
          :to="{ name: 'noticias' }"
          class="inline-flex min-h-12 items-center rounded-full border-2 border-floresta px-6 font-bold text-floresta hover:bg-floresta/5"
        >
          Ver todas as notícias
        </RouterLink>
      </div>

      <div class="flex flex-wrap gap-5">
        <NoticiaCard :noticia="destaque" variante="destaque" class="min-w-0 flex-[1.4_1_480px]" />
        <div v-if="outras.length" class="flex min-w-0 flex-[1_1_340px] flex-col gap-5">
          <NoticiaCard v-for="noticia in outras" :key="noticia.id" :noticia="noticia" variante="compacta" class="flex-1" />
        </div>
      </div>
    </div>
  </section>
</template>
