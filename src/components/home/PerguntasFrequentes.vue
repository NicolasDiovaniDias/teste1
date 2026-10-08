<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { empresa } from '@/config'
import { PERGUNTAS } from '@/data/perguntas'
</script>

<template>
  <section id="duvidas" aria-labelledby="titulo-duvidas" class="scroll-mt-4 bg-white px-6 py-24">
    <div class="mx-auto flex max-w-6xl flex-wrap gap-x-16 gap-y-10">
      <div class="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5">
        <p class="text-sm font-bold text-folha">Dúvidas</p>
        <h2 id="titulo-duvidas" class="font-display text-[clamp(2rem,3.4vw,3.1rem)] leading-[1.08] font-extrabold tracking-tight">
          Perguntas frequentes
        </h2>
        <p class="text-[17px] leading-relaxed text-musgo">Não achou sua resposta? Fale com a gente pelo {{ empresa.whatsapp }}.</p>
      </div>

      <Accordion type="single" collapsible default-value="pergunta-0" class="flex min-w-0 flex-[2_1_560px] flex-col gap-3">
        <AccordionItem
          v-for="(item, indice) in PERGUNTAS"
          :key="item.pergunta"
          :value="`pergunta-${indice}`"
          class="rounded-[18px] border border-linha bg-[#f8faf7] px-6"
        >
          <AccordionTrigger class="min-h-16 items-center py-5 text-lg font-bold hover:no-underline">
            {{ item.pergunta }}
          </AccordionTrigger>
          <AccordionContent class="pb-5 text-base leading-relaxed text-musgo">
            {{ item.resposta }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
</template>
