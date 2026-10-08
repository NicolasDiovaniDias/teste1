<script setup lang="ts">
import { Lock } from '@lucide/vue'
import { empresa } from '@/config'
import LogoMarca from './LogoMarca.vue'

const ano = new Date().getFullYear()
</script>

<template>
  <footer id="contato" class="bg-floresta px-6 pt-16 pb-8 text-nevoa">
    <div class="mx-auto flex max-w-6xl flex-col gap-10">
      <div class="flex flex-wrap justify-between gap-x-16 gap-y-10">
        <div class="flex max-w-sm flex-[1_1_280px] flex-col gap-4">
          <RouterLink :to="{ name: 'inicio' }" class="flex min-h-11 items-center self-start rounded-lg text-white">
            <LogoMarca :tamanho="56" />
          </RouterLink>
          <p class="text-[15px] leading-relaxed">
            <span class="font-semibold text-white">{{ empresa.nomeCompleto }}.</span>
            Coleta seletiva porta a porta em {{ empresa.cidade }}.
          </p>
        </div>

        <div class="flex flex-[0_1_220px] flex-col gap-2.5 text-[15px]">
          <h2 class="mb-1 text-base font-bold text-white">Contato</h2>
          <a v-if="empresa.whatsappLink" :href="empresa.whatsappLink" class="underline-offset-4 hover:underline">{{ empresa.whatsapp }}</a>
          <span v-else>{{ empresa.whatsapp }}</span>
          <span>{{ empresa.email }}</span>
          <span>{{ empresa.endereco }}</span>
        </div>

        <div class="flex flex-[0_1_200px] flex-col text-[15px]">
          <h2 class="mb-1 text-base font-bold text-white">Navegação</h2>
          <RouterLink :to="{ name: 'inicio', hash: '#como-funciona' }" class="flex min-h-11 items-center hover:text-white">Como funciona</RouterLink>
          <RouterLink :to="{ name: 'inicio', hash: '#o-que-separar' }" class="flex min-h-11 items-center hover:text-white">O que separar</RouterLink>
          <RouterLink :to="{ name: 'noticias' }" class="flex min-h-11 items-center hover:text-white">Notícias</RouterLink>
          <RouterLink :to="{ name: 'consulta' }" class="flex min-h-11 items-center hover:text-white">Consultar meu bairro</RouterLink>
        </div>

        <div class="flex flex-[0_1_200px] flex-col text-[15px]">
          <h2 class="mb-1 text-base font-bold text-white">Equipe</h2>
          <RouterLink :to="{ name: 'painel' }" class="flex min-h-11 items-center gap-2 font-bold text-broto hover:text-white">
            <Lock class="size-[18px]" aria-hidden="true" />
            Área restrita
          </RouterLink>
        </div>
      </div>

      <div class="flex flex-wrap justify-between gap-3 border-t border-white/15 pt-6 text-sm text-[#a9c4b3]">
        <span>© {{ ano }} {{ empresa.nome }}. Todos os direitos reservados.</span>
        <a href="#" class="underline-offset-4 hover:underline">Política de privacidade</a>
      </div>
    </div>
  </footer>
</template>
