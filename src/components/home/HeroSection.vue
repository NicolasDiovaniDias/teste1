<script setup lang="ts">
import { ArrowRight, ImageIcon, Leaf, Search } from '@lucide/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { empresa } from '@/config'
import { MATERIAIS } from '@/data/materiais'

const router = useRouter()
const busca = ref('')

function consultar() {
  const termo = busca.value.trim()
  router.push({ name: 'consulta', query: termo ? { busca: termo } : {} })
}
</script>

<template>
  <section class="overflow-hidden bg-floresta px-6 pt-12 pb-32 text-white">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-14">
      <div class="flex min-w-0 flex-[1_1_520px] flex-col gap-6">
        <p class="inline-flex items-center gap-2 self-start rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-nevoa">
          <Leaf class="size-4" aria-hidden="true" />
          Coleta seletiva porta a porta em {{ empresa.cidade }}
        </p>

        <h1 class="font-display text-[clamp(2.6rem,5.2vw,4.75rem)] leading-[1.02] font-extrabold tracking-tight">
          Separe em casa.<br />
          A gente leva para a <span class="text-broto">RECICLAGEM.</span>
        </h1>

        <p class="max-w-xl text-lg leading-relaxed text-nevoa sm:text-[19px]">
          Confira os dias e turnos da coleta seletiva no seu bairro e aprenda o que pode (e o que não pode) ir para a reciclagem.
        </p>

        <form role="search" class="flex max-w-xl flex-col gap-2.5" @submit.prevent="consultar">
          <label for="hero-bairro" class="text-[15px] font-bold">Qual é o seu bairro?</label>
          <div class="flex flex-wrap gap-2 rounded-2xl bg-white p-2 focus-within:ring-4 focus-within:ring-broto">
            <div class="flex min-h-13 flex-[1_1_240px] items-center gap-2.5 px-3 text-musgo">
              <Search class="size-5 shrink-0" aria-hidden="true" />
              <input
                id="hero-bairro"
                v-model="busca"
                type="text"
                autocomplete="off"
                placeholder="Digite o nome do bairro"
                class="w-full min-w-0 bg-transparent py-3 text-[17px] text-tinta outline-none placeholder:text-musgo"
              />
            </div>
            <button
              type="submit"
              class="inline-flex min-h-13 flex-[0_0_auto] items-center justify-center gap-2 rounded-xl bg-floresta px-6 font-bold text-white hover:bg-[#164d38]"
            >
              Ver dias de coleta
              <ArrowRight class="size-[18px]" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>

      <div class="relative min-w-0 flex-[1_1_440px] pb-12">
        <!-- Troque este bloco por uma <img> com a foto real do cliente -->
        <div
          class="flex h-[460px] flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-white/30 bg-white/5 p-6 text-center text-nevoa"
        >
          <ImageIcon class="size-10" stroke-width="1.6" aria-hidden="true" />
          <span class="font-bold">[FOTO: equipe da coleta ou caminhão em ação]</span>
        </div>

        <div class="absolute bottom-0 left-5 flex max-w-[330px] flex-col gap-3 rounded-[20px] bg-white p-5 text-tinta shadow-[0_18px_40px_rgba(6,24,16,0.28)]">
          <span class="text-sm font-bold text-musgo">Vai na coleta seletiva</span>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="material in MATERIAIS"
              :key="material.nome"
              class="inline-flex items-center gap-1.5 rounded-full bg-areia px-3 py-1.5 text-sm font-bold"
            >
              <span :class="['size-2.5 rounded-full', material.classeCor]" aria-hidden="true" />
              {{ material.nome }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
