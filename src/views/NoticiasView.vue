<script setup lang="ts">
import { onMounted } from 'vue'
import NoticiaCard from '@/components/noticias/NoticiaCard.vue'
import { empresa } from '@/config'
import { useNoticiasStore } from '@/stores/noticias'

const store = useNoticiasStore()
onMounted(() => store.carregar())
</script>

<template>
  <section class="bg-floresta px-6 pt-8 pb-14 text-white">
    <div class="mx-auto flex max-w-6xl flex-col gap-3.5">
      <nav aria-label="Você está em" class="flex flex-wrap items-center gap-2 text-sm text-[#cfe0d5]">
        <RouterLink :to="{ name: 'inicio' }" class="underline underline-offset-4">Início</RouterLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Notícias</span>
      </nav>
      <h1 class="font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.04] font-extrabold tracking-tight">
        Notícias e avisos da <span class="text-broto">{{ empresa.nome }}</span>
      </h1>
      <p class="max-w-2xl text-lg leading-relaxed text-nevoa">Mudanças na coleta, horários de feriado e novidades da cooperativa.</p>
    </div>
  </section>

  <div class="px-6 pt-12 pb-24">
    <div class="mx-auto max-w-6xl">
      <p v-if="store.erro" role="alert" class="rounded-2xl bg-[#fdecea] p-4 font-semibold text-[#7a1e17]">
        {{ store.erro }}
        <button type="button" class="ml-1 underline underline-offset-4" @click="store.carregar(true)">Tentar de novo</button>
      </p>

      <ul v-else-if="!store.carregou" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Carregando notícias">
        <li v-for="item in 3" :key="item" class="h-96 animate-pulse rounded-[22px] bg-white" />
      </ul>

      <ul v-else-if="store.publicadas.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="noticia in store.publicadas" :key="noticia.id" class="flex">
          <NoticiaCard :noticia="noticia" nivel-titulo="h2" class="w-full" />
        </li>
      </ul>

      <div v-else class="flex flex-col items-start gap-3 rounded-3xl border-2 border-dashed border-[#cfdcd2] p-8">
        <p class="text-lg font-bold">Ainda não há notícias publicadas.</p>
        <p class="text-musgo">Enquanto isso, confira os dias da coleta no seu bairro.</p>
        <RouterLink
          :to="{ name: 'consulta' }"
          class="mt-2 inline-flex min-h-12 items-center rounded-full bg-floresta px-6 font-bold text-white hover:bg-[#164d38]"
        >
          Consultar meu bairro
        </RouterLink>
      </div>
    </div>
  </div>
</template>
