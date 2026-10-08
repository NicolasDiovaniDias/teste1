<script setup lang="ts">
import { ExternalLink, Pencil, Trash2 } from '@lucide/vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CapaNoticia from '@/components/noticias/CapaNoticia.vue'
import { Button } from '@/components/ui/button'
import { formatarDataCurta } from '@/lib/datas'
import { situacao } from '@/lib/noticias'
import type { Noticia, SituacaoNoticia } from '@/types/noticia'

const props = defineProps<{ noticias: Noticia[] }>()
const emit = defineEmits<{ editar: [noticia: Noticia]; excluir: [noticia: Noticia] }>()
const router = useRouter()

const SITUACOES: Record<SituacaoNoticia, { rotulo: string; classe: string; ponto: string }> = {
  publicada: { rotulo: 'Publicada', classe: 'bg-[#e3f2e7] text-[#14532d]', ponto: 'bg-[#1f7a4d]' },
  agendada: { rotulo: 'Agendada', classe: 'bg-[#e6effa] text-[#17457f]', ponto: 'bg-[#1f5fad]' },
  rascunho: { rotulo: 'Rascunho', classe: 'bg-[#eceae4] text-[#3f4842]', ponto: 'border-2 border-[#7a7468]' },
}

const linhas = computed(() =>
  props.noticias.map((noticia) => ({
    noticia,
    situacao: SITUACOES[situacao(noticia)],
    // Endereço público da notícia (rascunhos abrem como pré-visualização)
    link: router.resolve({ name: 'noticia', params: { id: noticia.id } }).href,
  })),
)

const colunas = 'lg:grid lg:grid-cols-[88px_minmax(220px,1fr)_110px_120px_auto] lg:items-center lg:gap-4'
</script>

<template>
  <div>
    <div
      aria-hidden="true"
      :class="[colunas, 'hidden border-t border-[#e6ece6] bg-areia px-5 py-3 text-[13px] font-bold text-musgo']"
    >
      <span class="col-span-2">Notícia</span>
      <span>Data</span>
      <span>Situação</span>
      <span class="text-right">Ações</span>
    </div>

    <ul>
      <li
        v-for="linha in linhas"
        :key="linha.noticia.id"
        :class="[colunas, 'flex flex-col gap-3 border-t border-[#e6ece6] px-5 py-4']"
      >
        <CapaNoticia :imagem="linha.noticia.imagem" :chave="linha.noticia.id" class="hidden aspect-[4/3] w-[88px] rounded-xl lg:block" />

        <div class="flex min-w-0 flex-col gap-1">
          <strong class="leading-snug font-bold">{{ linha.noticia.titulo }}</strong>
          <span class="line-clamp-1 text-sm text-musgo">{{ linha.noticia.resumo }}</span>
        </div>

        <span class="text-[15px] text-[#34463c]">
          <span class="lg:sr-only">Data: </span>{{ formatarDataCurta(linha.noticia.publicadaEm) }}
        </span>

        <div>
          <span :class="['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-bold', linha.situacao.classe]">
            <span :class="['size-2 rounded-full', linha.situacao.ponto]" aria-hidden="true" />
            {{ linha.situacao.rotulo }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2 lg:justify-end">
          <Button as="a" :href="linha.link" target="_blank" rel="noopener" variant="ghost" class="h-11 rounded-[10px] px-3 font-semibold text-folha">
            <ExternalLink aria-hidden="true" />
            Ver
            <span class="sr-only">{{ linha.noticia.titulo }} (abre em nova aba)</span>
          </Button>
          <Button variant="outline" class="h-11 rounded-[10px] px-3 font-semibold" @click="emit('editar', linha.noticia)">
            <Pencil aria-hidden="true" />
            Editar
            <span class="sr-only">{{ linha.noticia.titulo }}</span>
          </Button>
          <Button
            variant="outline"
            class="h-11 rounded-[10px] border-[#efc9c5] px-3 font-semibold text-[#a12a23] hover:bg-[#fdecea] hover:text-[#7a1e17]"
            @click="emit('excluir', linha.noticia)"
          >
            <Trash2 aria-hidden="true" />
            Excluir
            <span class="sr-only">{{ linha.noticia.titulo }}</span>
          </Button>
        </div>
      </li>
    </ul>

    <p v-if="noticias.length === 0" class="border-t border-[#e6ece6] px-5 py-10 text-center text-musgo">
      Nenhuma notícia encontrada. Confira a busca ou o filtro.
    </p>
  </div>
</template>
