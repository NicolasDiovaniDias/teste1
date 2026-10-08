<script setup lang="ts">
import TituloSecao from './TituloSecao.vue'
</script>

<template>
  <section aria-labelledby="titulo-destinos" class="px-6 py-24">
    <div class="mx-auto flex max-w-6xl flex-col gap-12">
      <TituloSecao id="titulo-destinos" rotulo="Nem tudo é reciclável">
        Para onde vai cada resíduo
        <template #descricao>Separar certo também é saber o que não vai na coleta seletiva.</template>
      </TituloSecao>

      <div class="flex flex-wrap gap-5">
        <article class="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-[22px] border border-linha bg-white p-7">
          <span class="self-start rounded-full bg-[#e3f2e7] px-3 py-1.5 text-[13px] font-bold text-[#14532d]">Coleta seletiva</span>
          <h3 class="font-display text-2xl font-extrabold">Recicláveis secos</h3>
          <p class="leading-relaxed text-musgo">
            Papel, plástico, vidro e metal, limpos e secos. Nossa equipe recolhe porta a porta, nos dias do seu bairro.
          </p>
          <RouterLink
            :to="{ name: 'consulta' }"
            class="mt-auto inline-flex min-h-11 items-center self-start font-bold text-folha underline-offset-4 hover:underline"
          >
            Consultar dias e turnos
          </RouterLink>
        </article>

        <article class="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-[22px] border border-linha bg-white p-7">
          <span class="self-start rounded-full bg-[#eceae4] px-3 py-1.5 text-[13px] font-bold text-[#3f4842]">Coleta comum</span>
          <h3 class="font-display text-2xl font-extrabold">Orgânicos e rejeitos</h3>
          <p class="leading-relaxed text-musgo">
            Restos de comida, cascas, papel higiênico, fraldas e absorventes seguem na coleta comum, nos horários de sempre.
          </p>
          <p class="text-[15px] leading-relaxed text-[#34463c]">
            <strong>Dica:</strong> cascas de frutas e verduras podem virar adubo numa composteira caseira.
          </p>
        </article>

        <article class="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-[22px] border border-linha bg-white p-7">
          <span class="self-start rounded-full bg-[#fdf4d6] px-3 py-1.5 text-[13px] font-bold text-[#6b5106]">Pontos de entrega</span>
          <h3 class="font-display text-2xl font-extrabold">Resíduos especiais</h3>
          <p class="leading-relaxed text-musgo">
            Pilhas, baterias, lâmpadas, eletrônicos, óleo de cozinha, pneus e embalagens de agrotóxico nunca vão no lixo de casa.
            Devolva onde comprou ou leve a um ponto de entrega.
          </p>
          <p class="text-[15px] leading-relaxed text-[#34463c]">[LISTA DE PONTOS DE ENTREGA DA CIDADE]</p>
        </article>
      </div>
    </div>
  </section>
</template>
