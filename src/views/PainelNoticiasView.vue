<script setup lang="ts">
import { LoaderCircle, Plus, Search } from '@lucide/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import FormNoticia from '@/components/admin/FormNoticia.vue'
import TabelaNoticias from '@/components/admin/TabelaNoticias.vue'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { mensagemDeErro } from '@/services/http'
import { situacao } from '@/lib/noticias'
import { normalizar } from '@/lib/texto'
import { useNoticiasStore } from '@/stores/noticias'
import type { Noticia, SituacaoNoticia } from '@/types/noticia'

const store = useNoticiasStore()
const route = useRoute()
const router = useRouter()

// ---- Busca e filtro ----
type Filtro = 'todas' | SituacaoNoticia
const busca = ref('')
const filtro = ref<Filtro>('todas')
const filtros: { valor: Filtro; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'publicada', rotulo: 'Publicadas' },
  { valor: 'agendada', rotulo: 'Agendadas' },
  { valor: 'rascunho', rotulo: 'Rascunhos' },
]

const lista = computed(() => {
  const termo = normalizar(busca.value)
  return store.ordenadas.filter((noticia) => {
    if (termo && !normalizar(noticia.titulo).includes(termo)) return false
    return filtro.value === 'todas' || situacao(noticia) === filtro.value
  })
})

const resumo = computed(() => [
  { rotulo: 'Notícias cadastradas', valor: store.noticias.length },
  { rotulo: 'Publicadas no site', valor: store.publicadas.length },
  { rotulo: 'Rascunhos e agendadas', valor: store.noticias.length - store.publicadas.length },
])

// ---- Criar e editar ----
const formAberto = ref(false)
const emEdicao = ref<Noticia | null>(null)

function novaNoticia() {
  emEdicao.value = null
  formAberto.value = true
}

function editar(noticia: Noticia) {
  emEdicao.value = noticia
  formAberto.value = true
}

onMounted(async () => {
  await store.carregar()
  // Vindo do link "Editar no painel" da pré-visualização: /admin/noticias?editar=<id>
  const id = route.query.editar
  if (typeof id === 'string') {
    const noticia = store.porId(id)
    if (noticia) editar(noticia)
    router.replace({ query: {} })
  }
})

// ---- Excluir ----
const paraExcluir = ref<Noticia | null>(null)
const excluindo = ref(false)
const confirmacaoAberta = computed({
  get: () => paraExcluir.value !== null,
  set: (aberta) => {
    if (!aberta) paraExcluir.value = null
  },
})

async function confirmarExclusao() {
  if (!paraExcluir.value) return
  const { id, titulo } = paraExcluir.value
  excluindo.value = true
  try {
    await store.excluir(id)
    toast.success(`Notícia “${titulo}” excluída.`)
    paraExcluir.value = null
  } catch (e) {
    toast.error(mensagemDeErro(e, 'Não foi possível excluir a notícia. Tente de novo.'))
  } finally {
    excluindo.value = false
  }
}
</script>

<template>
  <main class="mx-auto flex max-w-7xl flex-col gap-6 px-6 pt-8 pb-16">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="flex flex-col gap-1.5">
        <h1 class="font-display text-[38px] leading-tight font-extrabold tracking-tight">Notícias</h1>
        <p class="text-musgo">As notícias publicadas aparecem na página inicial e na página de notícias do site.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button class="h-12 rounded-xl bg-broto px-5 text-base font-extrabold text-floresta hover:bg-[#c6ec66]" @click="novaNoticia">
          <Plus aria-hidden="true" />
          Nova notícia
        </Button>
      </div>
    </div>

    <dl class="flex flex-wrap gap-4">
      <div
        v-for="item in resumo"
        :key="item.rotulo"
        class="flex flex-[1_1_200px] flex-col-reverse gap-1 rounded-[18px] border border-linha bg-white px-5 py-4"
      >
        <dt class="text-sm font-semibold text-musgo">{{ item.rotulo }}</dt>
        <dd class="font-display text-[34px] leading-tight font-extrabold text-floresta">{{ item.valor }}</dd>
      </div>
    </dl>

    <section aria-labelledby="titulo-lista-noticias" class="overflow-hidden rounded-[22px] border border-linha bg-white">
      <h2 id="titulo-lista-noticias" class="sr-only">Lista de notícias</h2>
      <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div
          class="flex min-h-12 max-w-sm flex-[1_1_240px] items-center gap-2 rounded-xl border-2 border-input px-3 text-musgo focus-within:border-folha"
        >
          <Search class="size-[18px] shrink-0" aria-hidden="true" />
          <label for="busca-noticias" class="sr-only">Buscar notícia</label>
          <input
            id="busca-noticias"
            v-model="busca"
            type="text"
            autocomplete="off"
            placeholder="Buscar pelo título"
            class="w-full min-w-0 bg-transparent py-2.5 text-[15px] text-tinta outline-none placeholder:text-musgo"
          />
        </div>
        <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por situação">
          <button
            v-for="opcao in filtros"
            :key="opcao.valor"
            type="button"
            :aria-pressed="filtro === opcao.valor"
            :class="[
              'min-h-11 rounded-full border-2 px-3.5 text-sm font-bold',
              filtro === opcao.valor ? 'border-floresta bg-floresta text-white' : 'border-[#cfdcd2] bg-white text-tinta hover:border-folha',
            ]"
            @click="filtro = opcao.valor"
          >
            {{ opcao.rotulo }}
          </button>
        </div>
      </div>

      <div v-if="!store.carregou && !store.erro" class="flex items-center gap-2 border-t border-[#e6ece6] px-5 py-10 text-musgo">
        <LoaderCircle class="size-5 animate-spin" aria-hidden="true" />
        Carregando notícias...
      </div>
      <p v-else-if="store.erro" role="alert" class="border-t border-[#e6ece6] px-5 py-8 font-semibold text-[#7a1e17]">
        {{ store.erro }}
        <button type="button" class="ml-1 underline underline-offset-4" @click="store.carregar(true)">Tentar de novo</button>
      </p>
      <TabelaNoticias v-else :noticias="lista" @editar="editar" @excluir="(noticia) => (paraExcluir = noticia)" />
    </section>
  </main>

  <FormNoticia v-model:open="formAberto" :noticia="emEdicao" />

  <AlertDialog v-model:open="confirmacaoAberta">
    <AlertDialogContent class="rounded-3xl">
      <AlertDialogHeader>
        <AlertDialogTitle class="font-display text-2xl font-extrabold">Excluir “{{ paraExcluir?.titulo }}”?</AlertDialogTitle>
        <AlertDialogDescription class="text-base">
          A notícia sai do site e do painel. Essa ação não pode ser desfeita.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="gap-2">
        <AlertDialogCancel class="h-11 rounded-xl px-5 font-bold">Cancelar</AlertDialogCancel>
        <Button variant="destructive" class="h-11 rounded-xl px-5 font-bold" :disabled="excluindo" @click="confirmarExclusao">
          <LoaderCircle v-if="excluindo" class="animate-spin" aria-hidden="true" />
          Excluir notícia
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
