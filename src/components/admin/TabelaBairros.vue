<script setup lang="ts">
import { Pencil, Trash2 } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { ordenarTurnos, resumirTurno } from '@/lib/coleta'
import type { Bairro } from '@/types/coleta'

defineProps<{ bairros: Bairro[] }>()
const emit = defineEmits<{ editar: [bairro: Bairro]; excluir: [bairro: Bairro] }>()

const colunas = 'md:grid md:grid-cols-[minmax(140px,1.1fr)_minmax(200px,2fr)_130px_auto] md:items-center md:gap-4'
</script>

<template>
  <div>
    <div
      aria-hidden="true"
      :class="[colunas, 'hidden border-t border-[#e6ece6] bg-areia px-5 py-3 text-[13px] font-bold text-musgo']"
    >
      <span>Bairro</span>
      <span>Dias e turnos</span>
      <span>Situação</span>
      <span class="text-right">Ações</span>
    </div>

    <ul>
      <li
        v-for="bairro in bairros"
        :key="bairro.id"
        :class="[colunas, 'flex flex-col gap-3 border-t border-[#e6ece6] px-5 py-4']"
      >
        <strong class="text-base font-bold">{{ bairro.nome }}</strong>

        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(turno, indice) in ordenarTurnos(bairro.turnos)"
            :key="indice"
            class="rounded-full bg-[#eef3ee] px-2.5 py-1 text-[13px] font-semibold text-[#24382c]"
          >
            {{ resumirTurno(turno) }}
          </span>
          <span v-if="bairro.turnos.length === 0" class="text-sm text-[#5b6b62]">Nenhum turno</span>
        </div>

        <div>
          <span
            v-if="bairro.ativo"
            class="inline-flex items-center gap-1.5 rounded-full bg-[#e3f2e7] px-2.5 py-1 text-[13px] font-bold text-[#14532d]"
          >
            <span class="size-2 rounded-full bg-[#1f7a4d]" aria-hidden="true" />
            Com coleta
          </span>
          <span v-else class="inline-flex items-center gap-1.5 rounded-full bg-[#eceae4] px-2.5 py-1 text-[13px] font-bold text-[#3f4842]">
            <span class="size-2 rounded-full border-2 border-[#7a7468]" aria-hidden="true" />
            Sem coleta
          </span>
        </div>

        <div class="flex gap-2 md:justify-end">
          <Button variant="outline" class="h-11 rounded-[10px] px-3 font-semibold" @click="emit('editar', bairro)">
            <Pencil aria-hidden="true" />
            Editar
            <span class="sr-only">{{ bairro.nome }}</span>
          </Button>
          <Button
            variant="outline"
            class="h-11 rounded-[10px] border-[#efc9c5] px-3 font-semibold text-[#a12a23] hover:bg-[#fdecea] hover:text-[#7a1e17]"
            @click="emit('excluir', bairro)"
          >
            <Trash2 aria-hidden="true" />
            Excluir
            <span class="sr-only">{{ bairro.nome }}</span>
          </Button>
        </div>
      </li>
    </ul>

    <p v-if="bairros.length === 0" class="border-t border-[#e6ece6] px-5 py-10 text-center text-musgo">
      Nenhum bairro encontrado. Confira a busca ou o filtro.
    </p>
  </div>
</template>
