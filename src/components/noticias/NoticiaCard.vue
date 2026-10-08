<script setup lang="ts">
import { formatarData } from '@/lib/datas'
import type { Noticia } from '@/types/noticia'
import CapaNoticia from './CapaNoticia.vue'

withDefaults(
  defineProps<{
    noticia: Noticia
    /** destaque = maior, com resumo; compacta = imagem ao lado, sem resumo */
    variante?: 'normal' | 'destaque' | 'compacta'
    /** Nível do título, para seguir a ordem dos títulos da página */
    nivelTitulo?: 'h2' | 'h3'
  }>(),
  { variante: 'normal', nivelTitulo: 'h3' },
)
</script>

<template>
  <!-- O link do título cobre o card inteiro (after:absolute): um só link por notícia -->
  <article
    :class="[
      'group relative flex overflow-hidden rounded-[22px] border border-linha bg-white transition-shadow hover:shadow-[0_14px_34px_rgba(15,59,42,0.12)] has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-folha',
      variante === 'compacta' ? 'min-h-32 flex-row' : 'flex-col',
    ]"
  >
    <CapaNoticia
      :imagem="noticia.imagem"
      :chave="noticia.id"
      :class="variante === 'compacta' ? 'w-28 shrink-0 sm:w-40' : variante === 'destaque' ? 'aspect-[16/9]' : 'aspect-[16/10]'"
    />
    <div
      :class="[
        'flex flex-1 flex-col',
        variante === 'compacta' ? 'justify-center gap-1.5 p-4 sm:p-5' : 'gap-3 p-6',
        variante === 'destaque' ? 'sm:p-8' : '',
      ]"
    >
      <time :datetime="noticia.publicadaEm" class="text-sm font-semibold text-folha">{{ formatarData(noticia.publicadaEm) }}</time>
      <component
        :is="nivelTitulo"
        :class="[
          'font-display leading-tight font-extrabold text-balance',
          variante === 'destaque' ? 'text-[clamp(1.6rem,2.6vw,2.2rem)]' : variante === 'compacta' ? 'text-lg' : 'text-[22px]',
        ]"
      >
        <RouterLink
          :to="{ name: 'noticia', params: { id: noticia.id } }"
          class="decoration-2 underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-none"
        >
          {{ noticia.titulo }}
        </RouterLink>
      </component>
      <p
        :class="[
          'leading-relaxed text-musgo',
          variante === 'destaque' ? 'text-lg' : variante === 'compacta' ? 'line-clamp-2 text-[15px] max-sm:hidden' : 'line-clamp-3',
        ]"
      >
        {{ noticia.resumo }}
      </p>
    </div>
  </article>
</template>
