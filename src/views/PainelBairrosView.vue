<script setup lang="ts">
import { LoaderCircle, Plus, RotateCcw, Search } from '@lucide/vue'
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import FormBairro from '@/components/admin/FormBairro.vue'
import TabelaBairros from '@/components/admin/TabelaBairros.vue'
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
import { useBairrosStore } from '@/stores/bairros'
import type { Bairro } from '@/types/coleta'

const store = useBairrosStore()

onMounted(() => store.carregar())

// ---- Busca e filtro ----
type Filtro = 'todos' | 'ativos' | 'inativos'
const busca = ref('')
const filtro = ref<Filtro>('todos')
const filtros: { valor: Filtro; rotulo: string }[] = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'ativos', rotulo: 'Com coleta' },
  { valor: 'inativos', rotulo: 'Sem coleta' },
]

const lista = computed(() =>
  store.buscar(busca.value).filter((b) => {
    if (filtro.value === 'ativos') return b.ativo
    if (filtro.value === 'inativos') return !b.ativo
    return true
  }),
)

const resumo = computed(() => [
  { rotulo: 'Bairros cadastrados', valor: store.bairros.length },
  { rotulo: 'Com coleta seletiva', valor: store.totalAtivos },
  { rotulo: 'Sem coleta', valor: store.bairros.length - store.totalAtivos },
])

// ---- Criar e editar ----
const formAberto = ref(false)
const emEdicao = ref<Bairro | null>(null)

function novoBairro() {
  emEdicao.value = null
  formAberto.value = true
}

function editar(bairro: Bairro) {
  emEdicao.value = bairro
  formAberto.value = true
}

// ---- Excluir ----
const paraExcluir = ref<Bairro | null>(null)
const excluindo = ref(false)
const confirmacaoAberta = computed({
  get: () => paraExcluir.value !== null,
  set: (aberta) => {
    if (!aberta) paraExcluir.value = null
  },
})

async function confirmarExclusao() {
  if (!paraExcluir.value) return
  const { id, nome } = paraExcluir.value
  excluindo.value = true
  try {
    await store.excluir(id)
    toast.success(`Bairro “${nome}” excluído.`)
    paraExcluir.value = null
  } catch {
    toast.error('Não foi possível excluir o bairro. Tente de novo.')
  } finally {
    excluindo.value = false
  }
}

// ---- Outros ----
const modoDemo = import.meta.env.DEV

async function restaurarExemplo() {
  await store.restaurarExemplo()
  toast.success('Bairros de exemplo restaurados.')
}
</script>

<template>
  <main class="mx-auto flex max-w-7xl flex-col gap-6 px-6 pt-8 pb-16">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="flex flex-col gap-1.5">
        <h1 class="font-display text-[38px] leading-tight font-extrabold tracking-tight">Bairros e turnos</h1>
        <p class="text-musgo">O que você salvar aqui aparece na consulta pública do site.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button v-if="modoDemo" variant="ghost" class="h-12 rounded-xl px-4 font-semibold text-musgo" @click="restaurarExemplo">
          <RotateCcw aria-hidden="true" />
          Restaurar exemplo
        </Button>
        <Button class="h-12 rounded-xl bg-broto px-5 text-base font-extrabold text-floresta hover:bg-[#c6ec66]" @click="novoBairro">
          <Plus aria-hidden="true" />
          Adicionar bairro
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

    <section aria-labelledby="titulo-lista" class="overflow-hidden rounded-[22px] border border-linha bg-white">
      <h2 id="titulo-lista" class="sr-only">Lista de bairros</h2>
      <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div
          class="flex min-h-12 max-w-sm flex-[1_1_240px] items-center gap-2 rounded-xl border-2 border-input px-3 text-musgo focus-within:border-folha"
        >
          <Search class="size-[18px] shrink-0" aria-hidden="true" />
          <label for="busca-admin" class="sr-only">Buscar bairro</label>
          <input
            id="busca-admin"
            v-model="busca"
            type="text"
            autocomplete="off"
            placeholder="Buscar bairro"
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

      <div v-if="store.carregando" class="flex items-center gap-2 border-t border-[#e6ece6] px-5 py-10 text-musgo">
        <LoaderCircle class="size-5 animate-spin" aria-hidden="true" />
        Carregando bairros...
      </div>
      <p v-else-if="store.erro" role="alert" class="border-t border-[#e6ece6] px-5 py-8 font-semibold text-[#7a1e17]">
        {{ store.erro }}
        <button type="button" class="ml-1 underline underline-offset-4" @click="store.carregar(true)">Tentar de novo</button>
      </p>
      <TabelaBairros v-else :bairros="lista" @editar="editar" @excluir="(bairro) => (paraExcluir = bairro)" />
    </section>
  </main>

  <FormBairro v-model:open="formAberto" :bairro="emEdicao" />

  <AlertDialog v-model:open="confirmacaoAberta">
    <AlertDialogContent class="rounded-3xl">
      <AlertDialogHeader>
        <AlertDialogTitle class="font-display text-2xl font-extrabold">Excluir “{{ paraExcluir?.nome }}”?</AlertDialogTitle>
        <AlertDialogDescription class="text-base">
          O bairro deixa de aparecer na consulta do site. Essa ação não pode ser desfeita.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="gap-2">
        <AlertDialogCancel class="h-11 rounded-xl px-5 font-bold">Cancelar</AlertDialogCancel>
        <Button variant="destructive" class="h-11 rounded-xl px-5 font-bold" :disabled="excluindo" @click="confirmarExclusao">
          <LoaderCircle v-if="excluindo" class="animate-spin" aria-hidden="true" />
          Excluir bairro
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
