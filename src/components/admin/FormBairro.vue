<script setup lang="ts">
import { Info, LoaderCircle, Plus, Trash2 } from '@lucide/vue'
import { computed, reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { mensagemDeErro } from '@/services/http'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { DIAS, ORDEM_DIAS, PERIODOS } from '@/lib/coleta'
import { criarSlug, normalizar } from '@/lib/texto'
import { useBairrosStore } from '@/stores/bairros'
import type { Bairro, DiaSemana, Periodo, Turno } from '@/types/coleta'

/** bairro = null significa "novo bairro" */
const props = defineProps<{ bairro: Bairro | null }>()
const aberto = defineModel<boolean>('open', { required: true })

const store = useBairrosStore()
const novo = computed(() => props.bairro === null)

interface TurnoForm {
  chave: number
  dia: DiaSemana
  periodo: Periodo
  inicio: string
  fim: string
}

let proximaChave = 0
const nome = ref('')
const apelidos = ref('')
const ativo = ref(true)
const turnos = ref<TurnoForm[]>([])
const salvando = ref(false)
const erros = reactive<{ nome: string; turnos: string; horarios: Record<number, string> }>({
  nome: '',
  turnos: '',
  horarios: {},
})

function paraForm(turno: Turno): TurnoForm {
  return { chave: proximaChave++, dia: turno.dia, periodo: turno.periodo, inicio: turno.inicio ?? '', fim: turno.fim ?? '' }
}

// Toda vez que o painel abre, preenche o formulário com o bairro escolhido
watch(aberto, (estaAberto) => {
  if (!estaAberto) return
  nome.value = props.bairro?.nome ?? ''
  apelidos.value = (props.bairro?.apelidos ?? []).join(', ')
  ativo.value = props.bairro?.ativo ?? true
  turnos.value = props.bairro ? props.bairro.turnos.map(paraForm) : [paraForm({ dia: 1, periodo: 'manha' })]
  erros.nome = ''
  erros.turnos = ''
  erros.horarios = {}
})

// O aviso de erro some assim que a pessoa começa a corrigir o nome
watch(nome, () => (erros.nome = ''))

function adicionarTurno() {
  turnos.value.push(paraForm({ dia: 1, periodo: 'manha' }))
  erros.turnos = ''
}

function removerTurno(chave: number) {
  turnos.value = turnos.value.filter((t) => t.chave !== chave)
}

function validar(): boolean {
  erros.nome = ''
  erros.turnos = ''
  erros.horarios = {}

  const nomeLimpo = nome.value.trim()
  if (!nomeLimpo) erros.nome = 'Informe o nome do bairro.'
  else if (store.bairros.some((b) => b.id !== props.bairro?.id && normalizar(b.nome) === normalizar(nomeLimpo))) {
    erros.nome = 'Já existe um bairro com esse nome.'
  }

  if (ativo.value) {
    if (turnos.value.length === 0) erros.turnos = 'Adicione pelo menos um turno de coleta.'
    for (const turno of turnos.value) {
      if (turno.fim && !turno.inicio) erros.horarios[turno.chave] = 'Informe também o horário de início.'
      else if (turno.inicio && turno.fim && turno.fim <= turno.inicio) erros.horarios[turno.chave] = 'O fim precisa ser depois do início.'
    }
  }

  return !erros.nome && !erros.turnos && Object.keys(erros.horarios).length === 0
}

/** Gera um id para a URL que ainda não exista: "vila-nova", "vila-nova-2"... */
function gerarId(nomeDoBairro: string): string {
  const base = criarSlug(nomeDoBairro) || 'bairro'
  let id = base
  for (let n = 2; store.porId(id); n++) id = `${base}-${n}`
  return id
}

async function salvar() {
  if (!validar()) return
  salvando.value = true
  const nomeLimpo = nome.value.trim()
  try {
    await store.salvar({
      id: props.bairro?.id ?? gerarId(nomeLimpo),
      nome: nomeLimpo,
      apelidos: [...new Set(apelidos.value.split(',').map((a) => a.trim()).filter(Boolean))],
      ativo: ativo.value,
      // Os turnos ficam guardados mesmo se a coleta for desativada
      turnos: turnos.value.map(({ dia, periodo, inicio, fim }) => ({
        dia,
        periodo,
        ...(inicio ? { inicio } : {}),
        ...(fim ? { fim } : {}),
      })),
      area: props.bairro?.area,
      atualizadoEm: new Date().toISOString(),
    })
    toast.success(`Bairro “${nomeLimpo}” salvo.`)
    aberto.value = false
  } catch (e) {
    toast.error(mensagemDeErro(e, 'Não foi possível salvar o bairro. Tente de novo.'))
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <Sheet v-model:open="aberto">
    <SheetContent class="w-full gap-0 overflow-y-auto sm:max-w-lg">
      <form class="flex min-h-full flex-col" novalidate @submit.prevent="salvar">
        <SheetHeader class="border-b border-linha p-6">
          <SheetTitle class="font-display text-2xl font-extrabold">{{ novo ? 'Novo bairro' : 'Editar bairro' }}</SheetTitle>
          <SheetDescription>Os dados salvos aqui aparecem na consulta pública do site.</SheetDescription>
        </SheetHeader>

        <div class="flex flex-1 flex-col gap-6 p-6">
          <div class="flex flex-col gap-2">
            <Label for="nome-bairro" class="text-[15px] font-bold">Nome do bairro</Label>
            <Input
              id="nome-bairro"
              v-model="nome"
              autocomplete="off"
              placeholder="Ex.: Vila Nova"
              :aria-invalid="!!erros.nome"
              :aria-describedby="erros.nome ? 'erro-nome' : undefined"
              class="h-12 rounded-xl border-2 px-3.5 text-base md:text-base"
            />
            <p v-if="erros.nome" id="erro-nome" class="text-sm font-semibold text-[#a12a23]">{{ erros.nome }}</p>
          </div>

          <div class="flex flex-col gap-2">
            <Label for="apelidos-bairro" class="text-[15px] font-bold">
              Outros nomes <span class="font-normal text-musgo">(opcional)</span>
            </Label>
            <Input
              id="apelidos-bairro"
              v-model="apelidos"
              autocomplete="off"
              placeholder="Ex.: Santa Izabel, Jardim Krahe"
              aria-describedby="dica-apelidos"
              class="h-12 rounded-xl border-2 px-3.5 text-base md:text-base"
            />
            <p id="dica-apelidos" class="text-sm leading-relaxed text-musgo">
              Separe por vírgula. Use o nome que aparece no CEP dos Correios: assim a busca por CEP e por rua encontra este bairro.
            </p>
          </div>

          <div class="flex items-center justify-between gap-4 rounded-2xl bg-areia px-4 py-3.5">
            <Label for="bairro-ativo" class="flex flex-col items-start gap-0.5">
              <span class="text-[15px] font-bold">Coleta seletiva ativa</span>
              <span class="text-sm leading-snug font-normal text-musgo">Desligado, o bairro aparece como “sem coleta” no site.</span>
            </Label>
            <Switch id="bairro-ativo" v-model="ativo" />
          </div>

          <fieldset v-if="ativo" class="flex min-w-0 flex-col gap-3">
            <legend class="mb-3 text-[15px] font-bold">Turnos de coleta</legend>

            <div
              v-for="(turno, indice) in turnos"
              :key="turno.chave"
              class="flex flex-col gap-3 rounded-2xl border border-linha p-4"
            >
              <div class="flex flex-wrap items-end gap-3">
                <div class="flex min-w-0 flex-[1_1_130px] flex-col gap-1.5">
                  <Label :for="`dia-${turno.chave}`" class="text-[13px] font-bold text-[#34463c]">Dia</Label>
                  <Select :model-value="String(turno.dia)" @update:model-value="(valor) => (turno.dia = Number(valor) as DiaSemana)">
                    <SelectTrigger :id="`dia-${turno.chave}`" class="h-11 w-full rounded-[10px] border-2 data-[size=default]:h-11">
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="dia in ORDEM_DIAS" :key="dia" :value="String(dia)">{{ DIAS[dia].nome }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex min-w-0 flex-[1_1_110px] flex-col gap-1.5">
                  <Label :for="`periodo-${turno.chave}`" class="text-[13px] font-bold text-[#34463c]">Período</Label>
                  <Select :model-value="turno.periodo" @update:model-value="(valor) => (turno.periodo = valor as Periodo)">
                    <SelectTrigger :id="`periodo-${turno.chave}`" class="h-11 w-full rounded-[10px] border-2 data-[size=default]:h-11">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="(periodo, chave) in PERIODOS" :key="chave" :value="chave">{{ periodo.nome }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div class="flex flex-wrap items-end gap-3">
                <div class="flex min-w-0 flex-[1_1_100px] flex-col gap-1.5">
                  <Label :for="`inicio-${turno.chave}`" class="text-[13px] font-bold text-[#34463c]">Início (opcional)</Label>
                  <Input :id="`inicio-${turno.chave}`" v-model="turno.inicio" type="time" class="h-11 rounded-[10px] border-2" />
                </div>
                <div class="flex min-w-0 flex-[1_1_100px] flex-col gap-1.5">
                  <Label :for="`fim-${turno.chave}`" class="text-[13px] font-bold text-[#34463c]">Fim (opcional)</Label>
                  <Input :id="`fim-${turno.chave}`" v-model="turno.fim" type="time" class="h-11 rounded-[10px] border-2" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  class="size-11 rounded-[10px] border-[#efc9c5] text-[#a12a23] hover:bg-[#fdecea] hover:text-[#7a1e17]"
                  @click="removerTurno(turno.chave)"
                >
                  <Trash2 aria-hidden="true" />
                  <span class="sr-only">Remover turno {{ indice + 1 }}</span>
                </Button>
              </div>
              <p v-if="erros.horarios[turno.chave]" class="text-sm font-semibold text-[#a12a23]">{{ erros.horarios[turno.chave] }}</p>
            </div>

            <p v-if="erros.turnos" class="text-sm font-semibold text-[#a12a23]">{{ erros.turnos }}</p>

            <Button
              type="button"
              variant="outline"
              class="h-11 self-start rounded-xl border-2 border-dashed border-[#a9c4b3] font-bold text-folha"
              @click="adicionarTurno"
            >
              <Plus aria-hidden="true" />
              Adicionar turno
            </Button>
          </fieldset>

          <p v-else class="rounded-2xl border border-dashed border-linha p-4 text-sm leading-relaxed text-musgo">
            Os turnos ficam guardados. Se a coleta voltar, é só ligar de novo.
          </p>

          <p class="flex gap-2.5 text-sm leading-relaxed text-musgo">
            <Info class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              {{
                bairro?.area
                  ? 'A área deste bairro no mapa vem do arquivo de limites (GeoJSON) e não muda por aqui.'
                  : 'Este bairro ainda não tem área no mapa: ele aparece só na busca até receber os limites (GeoJSON).'
              }}
            </span>
          </p>
        </div>

        <SheetFooter class="flex-row gap-3 border-t border-linha p-6">
          <Button type="submit" :disabled="salvando" class="h-12 flex-1 rounded-xl text-base font-bold">
            <LoaderCircle v-if="salvando" class="animate-spin" aria-hidden="true" />
            {{ salvando ? 'Salvando...' : 'Salvar bairro' }}
          </Button>
          <Button type="button" variant="outline" class="h-12 rounded-xl border-2 px-5 text-base font-bold" @click="aberto = false">
            Cancelar
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>
