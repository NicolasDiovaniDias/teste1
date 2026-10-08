<script setup lang="ts">
const passos = [
  { titulo: 'Separe em casa', texto: 'Recicláveis secos de um lado. Restos de comida, papel higiênico e fraldas do outro.' },
  { titulo: 'Coloque na calçada', texto: 'Só no dia e no turno da coleta seletiva do seu bairro, em sacos bem fechados.' },
  { titulo: 'A coleta passa', texto: 'Nossa equipe recolhe o material porta a porta e leva tudo para a central de triagem.' },
  { titulo: 'Vira matéria-prima', texto: 'Separado por tipo e prensado, o material é vendido para a indústria fabricar novos produtos.' },
]
</script>

<template>
  <section id="como-funciona" aria-labelledby="titulo-como-funciona" class="scroll-mt-4 px-6 pt-24 pb-22">
    <div class="mx-auto flex max-w-6xl flex-col gap-14">
      <div class="flex flex-wrap items-end gap-x-16 gap-y-8">
        <div class="flex min-w-0 flex-[1_1_460px] flex-col gap-4">
          <p class="text-sm font-bold text-folha">O que é coleta seletiva?</p>
          <h2
            id="titulo-como-funciona"
            class="font-display text-[clamp(2rem,3.4vw,3.1rem)] leading-[1.08] font-extrabold tracking-tight text-balance"
          >
            Separar é o primeiro passo para o lixo virar
            <span class="box-decoration-clone rounded-lg bg-broto px-2">matéria-prima</span>
          </h2>
        </div>
        <div class="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5 text-[17px] leading-relaxed text-[#34463c]">
          <p>
            A coleta seletiva começa na sua casa: você separa os materiais recicláveis do lixo orgânico e dos rejeitos e coloca
            tudo na calçada no dia da coleta do seu bairro.
          </p>
          <p>
            Nossa equipe recolhe porta a porta e leva o material para a triagem, onde ele é separado por tipo, prensado e vendido
            para a indústria. Assim, o que iria para o aterro volta como matéria-prima de novos produtos.
          </p>
        </div>
      </div>

      <ol class="flex flex-wrap gap-5">
        <li
          v-for="(passo, indice) in passos"
          :key="passo.titulo"
          class="flex min-w-0 flex-[1_1_260px] flex-col gap-3.5 rounded-[22px] border border-linha bg-white p-7"
        >
          <span
            class="flex size-13 items-center justify-center rounded-2xl bg-broto font-display text-xl font-extrabold text-floresta"
            aria-hidden="true"
          >
            {{ String(indice + 1).padStart(2, '0') }}
          </span>
          <h3 class="font-display text-[22px] font-extrabold">{{ passo.titulo }}</h3>
          <p class="leading-relaxed text-musgo">{{ passo.texto }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
