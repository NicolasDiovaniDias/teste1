<script setup lang="ts">
import { ArrowLeft, Eye } from '@lucide/vue'
import { computed, onMounted, watchEffect } from 'vue'
import NoticiaCard from '@/components/noticias/NoticiaCard.vue'
import { empresa } from '@/config'
import { formatarData } from '@/lib/datas'
import { paragrafos, situacao } from '@/lib/noticias'
import { useAuthStore } from '@/stores/auth'
import { useNoticiasStore } from '@/stores/noticias'

// O :id da URL (/noticias/:id) chega aqui como prop (veja "props: true" nas rotas)
const props = defineProps<{ id: string }>()

const store = useNoticiasStore()
const auth = useAuthStore()
onMounted(() => store.carregar())

const noticia = computed(() => store.porId(props.id))
const estado = computed(() => (noticia.value ? situacao(noticia.value) : null))
// Rascunhos e agendadas só aparecem para quem está logado no painel (pré-visualização)
const visivel = computed(() => estado.value === 'publicada' || (estado.value !== null && auth.logado))
const textos = computed(() => (noticia.value ? paragrafos(noticia.value.conteudo) : []))
const outras = computed(() => store.publicadas.filter((n) => n.id !== props.id).slice(0, 3))

watchEffect(() => {
  if (visivel.value && noticia.value) document.title = `${noticia.value.titulo} | ${empresa.nome}`
})
</script>

<template>
  <!-- Carregando -->
  <div v-if="!store.carregou && !store.erro" class="px-6 py-16" aria-label="Carregando notícia">
    <div class="mx-auto flex max-w-3xl animate-pulse flex-col gap-4">
      <div class="h-5 w-40 rounded bg-white" />
      <div class="h-14 w-full rounded-xl bg-white" />
      <div class="h-40 w-full rounded-2xl bg-white" />
    </div>
  </div>

  <!-- Erro ao carregar -->
  <section v-else-if="store.erro" class="px-6 py-24">
    <p role="alert" class="mx-auto max-w-3xl rounded-2xl bg-[#fdecea] p-4 font-semibold text-[#7a1e17]">
      {{ store.erro }}
      <button type="button" class="ml-1 underline underline-offset-4" @click="store.carregar(true)">Tentar de novo</button>
    </p>
  </section>

  <!-- A notícia -->
  <article v-else-if="noticia && visivel">
    <div v-if="estado !== 'publicada'" class="bg-[#fdf4d6] px-6 py-3 text-[#4d3a04]">
      <p class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-semibold">
        <Eye class="size-[18px] shrink-0" aria-hidden="true" />
        <span>
          Pré-visualização:
          {{
            estado === 'rascunho'
              ? 'esta notícia é um rascunho e não aparece no site.'
              : `esta notícia está agendada e só aparece no site a partir de ${formatarData(noticia.publicadaEm)}.`
          }}
        </span>
        <RouterLink :to="{ name: 'admin-noticias', query: { editar: noticia.id } }" class="underline underline-offset-4">
          Editar no painel
        </RouterLink>
      </p>
    </div>

    <header :class="['bg-floresta px-6 pt-8 text-white', noticia.imagem ? 'pb-36' : 'pb-16']">
      <div class="mx-auto flex max-w-3xl flex-col gap-4">
        <nav aria-label="Você está em" class="flex flex-wrap items-center gap-2 text-sm text-[#cfe0d5]">
          <RouterLink :to="{ name: 'inicio' }" class="underline underline-offset-4">Início</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink :to="{ name: 'noticias' }" class="underline underline-offset-4">Notícias</RouterLink>
        </nav>
        <time :datetime="noticia.publicadaEm" class="mt-4 font-bold text-broto">{{ formatarData(noticia.publicadaEm) }}</time>
        <h1 class="font-display text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.05] font-extrabold tracking-tight text-balance">
          {{ noticia.titulo }}
        </h1>
        <p class="text-lg leading-relaxed text-nevoa sm:text-xl">{{ noticia.resumo }}</p>
      </div>
    </header>

    <div class="px-6 pb-20">
      <div class="mx-auto max-w-3xl">
        <figure v-if="noticia.imagem" class="-mt-24 overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(6,24,16,0.18)]">
          <img :src="noticia.imagem" :alt="noticia.imagemDescricao ?? ''" class="aspect-[16/9] w-full object-cover" />
        </figure>
        <div class="flex flex-col gap-6 pt-12 text-lg leading-[1.75] text-[#24382c]">
          <p v-for="(texto, indice) in textos" :key="indice" class="whitespace-pre-line">{{ texto }}</p>
        </div>
        <RouterLink
          :to="{ name: 'noticias' }"
          class="mt-12 inline-flex min-h-11 items-center gap-2 font-bold text-folha underline-offset-4 hover:underline"
        >
          <ArrowLeft class="size-[18px]" aria-hidden="true" />
          Todas as notícias
        </RouterLink>
      </div>
    </div>

    <section v-if="outras.length" aria-labelledby="titulo-outras" class="bg-white px-6 py-20">
      <div class="mx-auto flex max-w-6xl flex-col gap-10">
        <h2 id="titulo-outras" class="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold tracking-tight">Outras notícias</h2>
        <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="item in outras" :key="item.id" class="flex">
            <NoticiaCard :noticia="item" class="w-full" />
          </li>
        </ul>
      </div>
    </section>
  </article>

  <!-- Não existe, ou ainda não foi publicada -->
  <section v-else class="px-6 py-28">
    <div class="mx-auto flex max-w-xl flex-col items-start gap-5">
      <h1 class="font-display text-5xl leading-tight font-extrabold tracking-tight">Notícia não encontrada.</h1>
      <p class="text-lg leading-relaxed text-musgo">Ela pode ter sido removida ou o endereço está errado.</p>
      <RouterLink
        :to="{ name: 'noticias' }"
        class="inline-flex min-h-12 items-center rounded-full bg-floresta px-6 font-bold text-white hover:bg-[#164d38]"
      >
        Ver todas as notícias
      </RouterLink>
    </div>
  </section>
</template>
