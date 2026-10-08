<script setup lang="ts">
import { ImagePlus, Info, LoaderCircle, Trash2 } from '@lucide/vue'
import { computed, reactive, ref, useTemplateRef, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { empresa } from '@/config'
import { formatarData, hojeISO } from '@/lib/datas'
import { criarSlug } from '@/lib/texto'
import { enviarImagem } from '@/services/imagensApi'
import { useNoticiasStore } from '@/stores/noticias'
import type { Noticia } from '@/types/noticia'

/** noticia = null significa "nova notícia" */
const props = defineProps<{ noticia: Noticia | null }>()
const aberto = defineModel<boolean>('open', { required: true })

const store = useNoticiasStore()
const nova = computed(() => props.noticia === null)

const LIMITE_TITULO = 120
const LIMITE_RESUMO = 200

const titulo = ref('')
const resumo = ref('')
const conteudo = ref('')
const imagem = ref('')
const imagemDescricao = ref('')
const publicadaEm = ref('')
const publicada = ref(true)
const salvando = ref(false)
const preparandoImagem = ref(false)
const seletorImagem = useTemplateRef<HTMLInputElement>('seletorImagem')
const erros = reactive({ titulo: '', resumo: '', conteudo: '', publicadaEm: '', imagem: '' })

function limparErros() {
  erros.titulo = ''
  erros.resumo = ''
  erros.conteudo = ''
  erros.publicadaEm = ''
  erros.imagem = ''
}

// Toda vez que o painel abre, preenche o formulário com a notícia escolhida
watch(aberto, (estaAberto) => {
  if (!estaAberto) return
  const atual = props.noticia
  titulo.value = atual?.titulo ?? ''
  resumo.value = atual?.resumo ?? ''
  conteudo.value = atual?.conteudo ?? ''
  imagem.value = atual?.imagem ?? ''
  imagemDescricao.value = atual?.imagemDescricao ?? ''
  publicadaEm.value = atual?.publicadaEm ?? hojeISO()
  publicada.value = atual?.publicada ?? true
  limparErros()
})

// O aviso de erro de cada campo some assim que a pessoa começa a corrigir
watch(titulo, () => (erros.titulo = ''))
watch(resumo, () => (erros.resumo = ''))
watch(conteudo, () => (erros.conteudo = ''))
watch(publicadaEm, () => (erros.publicadaEm = ''))

const agendada = computed(() => publicada.value && publicadaEm.value > hojeISO())

async function aoEscolherImagem(evento: Event) {
  const campo = evento.target as HTMLInputElement
  const arquivo = campo.files?.[0]
  campo.value = '' // permite escolher o mesmo arquivo de novo
  if (!arquivo) return
  erros.imagem = ''
  preparandoImagem.value = true
  try {
    imagem.value = await enviarImagem(arquivo)
  } catch (e) {
    erros.imagem = e instanceof Error ? e.message : 'Não foi possível usar essa imagem.'
  } finally {
    preparandoImagem.value = false
  }
}

function removerImagem() {
  imagem.value = ''
  imagemDescricao.value = ''
}

function validar(): boolean {
  limparErros()
  const tituloLimpo = titulo.value.trim()
  const resumoLimpo = resumo.value.trim()
  if (!tituloLimpo) erros.titulo = 'Informe o título da notícia.'
  else if (tituloLimpo.length > LIMITE_TITULO) erros.titulo = `Use até ${LIMITE_TITULO} caracteres.`
  if (!resumoLimpo) erros.resumo = 'Escreva um resumo curto.'
  else if (resumoLimpo.length > LIMITE_RESUMO) erros.resumo = `Use até ${LIMITE_RESUMO} caracteres.`
  if (!conteudo.value.trim()) erros.conteudo = 'Escreva o texto da notícia.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publicadaEm.value)) erros.publicadaEm = 'Informe a data de publicação.'
  return !erros.titulo && !erros.resumo && !erros.conteudo && !erros.publicadaEm
}

/** Gera o endereço da notícia a partir do título: "Mutirão no Centro" -> "mutirao-no-centro" */
function gerarId(texto: string): string {
  const base = criarSlug(texto).slice(0, 80).replace(/-+$/, '') || 'noticia'
  let id = base
  for (let n = 2; store.porId(id); n++) id = `${base}-${n}`
  return id
}

async function salvar() {
  if (!validar()) return
  salvando.value = true
  const tituloLimpo = titulo.value.trim()
  const descricao = imagemDescricao.value.trim()
  try {
    await store.salvar({
      // Ao editar, o endereço não muda: links já compartilhados continuam funcionando
      id: props.noticia?.id ?? gerarId(tituloLimpo),
      titulo: tituloLimpo,
      resumo: resumo.value.trim(),
      conteudo: conteudo.value.trim(),
      ...(imagem.value ? { imagem: imagem.value } : {}),
      ...(imagem.value && descricao ? { imagemDescricao: descricao } : {}),
      publicadaEm: publicadaEm.value,
      publicada: publicada.value,
      atualizadoEm: new Date().toISOString(),
    })
    toast.success(`Notícia “${tituloLimpo}” salva.`)
    aberto.value = false
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Não foi possível salvar a notícia. Tente de novo.')
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <Sheet v-model:open="aberto">
    <SheetContent class="w-full gap-0 overflow-y-auto sm:max-w-xl">
      <form class="flex min-h-full flex-col" novalidate @submit.prevent="salvar">
        <SheetHeader class="border-b border-linha p-6">
          <SheetTitle class="font-display text-2xl font-extrabold">{{ nova ? 'Nova notícia' : 'Editar notícia' }}</SheetTitle>
          <SheetDescription>Notícias publicadas aparecem na página inicial e na página de notícias.</SheetDescription>
        </SheetHeader>

        <div class="flex flex-1 flex-col gap-6 p-6">
          <div class="flex flex-col gap-2">
            <Label for="titulo-noticia" class="text-[15px] font-bold">Título</Label>
            <Input
              id="titulo-noticia"
              v-model="titulo"
              autocomplete="off"
              placeholder="Ex.: Coleta seletiva chega ao bairro Centro"
              :aria-invalid="!!erros.titulo"
              :aria-describedby="erros.titulo ? 'erro-titulo' : undefined"
              class="h-12 rounded-xl border-2 px-3.5 text-base md:text-base"
            />
            <p v-if="erros.titulo" id="erro-titulo" class="text-sm font-semibold text-[#a12a23]">{{ erros.titulo }}</p>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-baseline justify-between gap-3">
              <Label for="resumo-noticia" class="text-[15px] font-bold">Resumo</Label>
              <span :class="['text-sm tabular-nums', resumo.trim().length > LIMITE_RESUMO ? 'font-semibold text-[#a12a23]' : 'text-musgo']">
                {{ resumo.trim().length }}/{{ LIMITE_RESUMO }}
              </span>
            </div>
            <Textarea
              id="resumo-noticia"
              v-model="resumo"
              rows="3"
              placeholder="Uma ou duas frases. Aparece nos cards e no topo da notícia."
              :aria-invalid="!!erros.resumo"
              :aria-describedby="erros.resumo ? 'erro-resumo' : undefined"
              class="min-h-24 rounded-xl border-2 px-3.5 py-3 text-base md:text-base"
            />
            <p v-if="erros.resumo" id="erro-resumo" class="text-sm font-semibold text-[#a12a23]">{{ erros.resumo }}</p>
          </div>

          <div class="flex flex-col gap-2">
            <Label for="texto-noticia" class="text-[15px] font-bold">Texto</Label>
            <Textarea
              id="texto-noticia"
              v-model="conteudo"
              rows="10"
              :aria-invalid="!!erros.conteudo"
              :aria-describedby="erros.conteudo ? 'dica-texto erro-texto' : 'dica-texto'"
              class="min-h-56 rounded-xl border-2 px-3.5 py-3 text-base leading-relaxed md:text-base"
            />
            <p id="dica-texto" class="text-sm text-musgo">Deixe uma linha em branco entre os parágrafos.</p>
            <p v-if="erros.conteudo" id="erro-texto" class="text-sm font-semibold text-[#a12a23]">{{ erros.conteudo }}</p>
          </div>

          <div class="flex flex-col gap-2.5">
            <span class="text-[15px] font-bold">Imagem de capa <span class="font-normal text-musgo">(opcional)</span></span>
            <div v-if="imagem" class="overflow-hidden rounded-2xl border border-linha">
              <img :src="imagem" alt="Prévia da imagem de capa" class="aspect-[16/9] w-full object-cover" />
            </div>
            <div class="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                class="h-11 rounded-xl border-2 font-bold"
                :disabled="preparandoImagem"
                @click="seletorImagem?.click()"
              >
                <LoaderCircle v-if="preparandoImagem" class="animate-spin" aria-hidden="true" />
                <ImagePlus v-else aria-hidden="true" />
                {{ preparandoImagem ? 'Preparando imagem...' : imagem ? 'Trocar imagem' : 'Escolher imagem' }}
              </Button>
              <Button
                v-if="imagem"
                type="button"
                variant="ghost"
                class="h-11 rounded-xl font-semibold text-[#a12a23] hover:bg-[#fdecea] hover:text-[#7a1e17]"
                @click="removerImagem"
              >
                <Trash2 aria-hidden="true" />
                Remover imagem
              </Button>
            </div>
            <input ref="seletorImagem" type="file" accept="image/*" class="hidden" @change="aoEscolherImagem" />
            <p v-if="erros.imagem" role="alert" class="text-sm font-semibold text-[#a12a23]">{{ erros.imagem }}</p>
            <p v-else class="text-sm text-musgo">Foto na horizontal fica melhor. Sem imagem, a notícia usa o símbolo da {{ empresa.nome }}.</p>
          </div>

          <div v-if="imagem" class="flex flex-col gap-2">
            <Label for="descricao-imagem" class="text-[15px] font-bold">
              Descrição da imagem <span class="font-normal text-musgo">(opcional)</span>
            </Label>
            <Input
              id="descricao-imagem"
              v-model="imagemDescricao"
              autocomplete="off"
              placeholder="Ex.: Cooperados separando garrafas na triagem"
              aria-describedby="dica-descricao"
              class="h-12 rounded-xl border-2 px-3.5 text-base md:text-base"
            />
            <p id="dica-descricao" class="text-sm text-musgo">Ajuda quem usa leitor de tela a entender a foto.</p>
          </div>

          <div class="flex flex-col gap-2">
            <Label for="data-noticia" class="text-[15px] font-bold">Data de publicação</Label>
            <Input
              id="data-noticia"
              v-model="publicadaEm"
              type="date"
              :aria-invalid="!!erros.publicadaEm"
              :aria-describedby="erros.publicadaEm ? 'erro-data' : undefined"
              class="h-12 w-full max-w-56 rounded-xl border-2 px-3.5 text-base md:text-base"
            />
            <p v-if="erros.publicadaEm" id="erro-data" class="text-sm font-semibold text-[#a12a23]">{{ erros.publicadaEm }}</p>
          </div>

          <div class="flex items-center justify-between gap-4 rounded-2xl bg-areia px-4 py-3.5">
            <Label for="noticia-publicada" class="flex flex-col items-start gap-0.5">
              <span class="text-[15px] font-bold">Publicada no site</span>
              <span class="text-sm leading-snug font-normal text-musgo">Desligado, fica salva como rascunho e só aparece aqui no painel.</span>
            </Label>
            <Switch id="noticia-publicada" v-model="publicada" />
          </div>

          <p v-if="agendada" class="flex gap-2.5 rounded-2xl bg-[#e6effa] p-4 text-sm leading-relaxed text-[#17457f]">
            <Info class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>Com data futura, a notícia fica agendada e só aparece no site a partir de {{ formatarData(publicadaEm) }}.</span>
          </p>
        </div>

        <SheetFooter class="flex-row gap-3 border-t border-linha p-6">
          <Button type="submit" :disabled="salvando || preparandoImagem" class="h-12 flex-1 rounded-xl text-base font-bold">
            <LoaderCircle v-if="salvando" class="animate-spin" aria-hidden="true" />
            {{ salvando ? 'Salvando...' : 'Salvar notícia' }}
          </Button>
          <Button type="button" variant="outline" class="h-12 rounded-xl border-2 px-5 text-base font-bold" @click="aberto = false">
            Cancelar
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>
