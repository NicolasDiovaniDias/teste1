<script setup lang="ts">
import { MapPin, Menu, X } from '@lucide/vue'
import { ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRoute } from 'vue-router'
import LogoMarca from './LogoMarca.vue'

const menuAberto = ref(false)
const route = useRoute()

// Fecha o menu do celular sempre que a página muda
watch(
  () => route.fullPath,
  () => (menuAberto.value = false),
)

interface LinkMenu {
  rotulo: string
  to: RouteLocationRaw
  /** Nomes das rotas em que o link aparece como página atual */
  rotas?: string[]
}

const links: LinkMenu[] = [
  { rotulo: 'Como funciona', to: { name: 'inicio', hash: '#como-funciona' } },
  { rotulo: 'O que separar', to: { name: 'inicio', hash: '#o-que-separar' } },
  { rotulo: 'Notícias', to: { name: 'noticias' }, rotas: ['noticias', 'noticia'] },
  { rotulo: 'Dúvidas', to: { name: 'inicio', hash: '#duvidas' } },
]

function ehAtual(link: LinkMenu) {
  return link.rotas?.includes(String(route.name)) ?? false
}
</script>

<template>
  <header class="bg-floresta text-white">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-4">
      <RouterLink :to="{ name: 'inicio' }" class="flex min-h-11 items-center rounded-lg">
        <LogoMarca />
      </RouterLink>

      <button
        type="button"
        class="inline-flex size-11 items-center justify-center rounded-xl text-white hover:bg-white/10 lg:hidden"
        :aria-expanded="menuAberto"
        aria-controls="menu-principal"
        @click="menuAberto = !menuAberto"
      >
        <X v-if="menuAberto" class="size-6" aria-hidden="true" />
        <Menu v-else class="size-6" aria-hidden="true" />
        <span class="sr-only">Menu</span>
      </button>

      <nav
        id="menu-principal"
        aria-label="Menu principal"
        :class="[
          menuAberto ? 'flex' : 'hidden',
          'w-full flex-col gap-1 pb-2 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-1.5 lg:pb-0',
        ]"
      >
        <!-- "custom" evita que os links da home fiquem todos marcados como página atual -->
        <RouterLink v-for="link in links" :key="link.rotulo" v-slot="{ href, navigate }" :to="link.to" custom>
          <a
            :href="href"
            :aria-current="ehAtual(link) ? 'page' : undefined"
            :class="[
              'inline-flex min-h-11 items-center rounded-lg px-3 text-[15px] font-semibold hover:bg-white/10 hover:text-white',
              ehAtual(link) ? 'text-white underline decoration-broto decoration-2 underline-offset-8' : 'text-[#e3eee6]',
            ]"
            @click="navigate"
          >
            {{ link.rotulo }}
          </a>
        </RouterLink>
        <RouterLink
          :to="{ name: 'consulta' }"
          class="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-broto px-5 text-[15px] font-bold text-floresta hover:bg-[#c6ec66] lg:mt-0 lg:ml-2"
        >
          <MapPin class="size-[18px]" aria-hidden="true" />
          Consultar meu bairro
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
