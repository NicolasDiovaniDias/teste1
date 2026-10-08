<script setup lang="ts">
import { CalendarDays, Check, Droplet, X } from '@lucide/vue'
import { MATERIAIS } from '@/data/materiais'
import TituloSecao from './TituloSecao.vue'
</script>

<template>
  <section id="o-que-separar" aria-labelledby="titulo-o-que-separar" class="scroll-mt-4 bg-white px-6 py-24">
    <div class="mx-auto flex max-w-6xl flex-col gap-12">
      <TituloSecao id="titulo-o-que-separar" rotulo="Resíduos recicláveis">
        O que pode ir na coleta seletiva
        <template #descricao>
          Cada material tem sua cor no padrão da coleta seletiva. Use a lista como guia na hora de separar.
        </template>
      </TituloSecao>

      <div class="flex flex-wrap gap-5">
        <article
          v-for="material in MATERIAIS"
          :key="material.nome"
          class="flex min-w-0 flex-[1_1_260px] flex-col overflow-hidden rounded-[22px] border border-linha bg-white"
        >
          <div :class="['flex items-center gap-3.5 px-6 py-5', material.classeCor, material.classeTexto]">
            <span class="flex size-12 items-center justify-center rounded-[14px] bg-black/10">
              <component :is="material.icone" class="size-6.5" aria-hidden="true" />
            </span>
            <h3 class="font-display text-2xl font-extrabold tracking-wide uppercase">{{ material.nome }}</h3>
          </div>

          <div class="flex flex-1 flex-col gap-4 px-6 pt-5 pb-6">
            <div>
              <p class="mb-2.5 text-sm font-bold text-folha">Pode</p>
              <ul class="flex flex-col gap-2">
                <li v-for="item in material.pode" :key="item" class="flex items-start gap-2.5">
                  <Check class="mt-0.5 size-[18px] shrink-0 text-folha" stroke-width="2.6" aria-hidden="true" />
                  {{ item }}
                </li>
              </ul>
            </div>
            <div class="border-t border-[#e6ece6] pt-4">
              <p class="mb-2.5 text-sm font-bold text-[#a12a23]">Não pode</p>
              <ul class="flex flex-col gap-2 text-[15px] text-musgo">
                <li v-for="item in material.naoPode" :key="item" class="flex items-start gap-2.5">
                  <X class="mt-0.5 size-4 shrink-0 text-[#a12a23]" stroke-width="2.6" aria-hidden="true" />
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>

      <div class="flex flex-wrap gap-5">
        <div class="flex min-w-0 flex-[1_1_420px] items-start gap-5 rounded-[22px] bg-floresta p-8 text-white">
          <span class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-broto text-floresta">
            <CalendarDays class="size-7" aria-hidden="true" />
          </span>
          <div class="flex flex-col gap-2">
            <p class="text-sm font-bold text-broto">Fique atento</p>
            <h3 class="font-display text-2xl leading-tight font-extrabold">Reciclável na calçada só no dia da coleta</h3>
            <p class="leading-relaxed text-nevoa">
              Coloque o material para fora no dia e no turno da coleta seletiva do seu bairro. Assim ele não molha, não espalha e
              chega inteiro à triagem.
            </p>
            <RouterLink
              :to="{ name: 'consulta' }"
              class="inline-flex min-h-11 items-center self-start font-bold text-broto underline-offset-4 hover:underline"
            >
              Ver os dias do meu bairro
            </RouterLink>
          </div>
        </div>

        <div class="flex min-w-0 flex-[1_1_420px] items-start gap-5 rounded-[22px] bg-broto p-8 text-floresta">
          <span class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-floresta text-broto">
            <Droplet class="size-7" aria-hidden="true" />
          </span>
          <div class="flex flex-col gap-2">
            <p class="text-sm font-bold">Não esqueça</p>
            <h3 class="font-display text-2xl leading-tight font-extrabold">Material limpo vale mais</h3>
            <p class="leading-relaxed text-[#1e3b2c]">
              Dê uma enxaguada rápida nas embalagens e mantenha papel e papelão secos. Material sujo contamina o restante e pode
              acabar no aterro.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
