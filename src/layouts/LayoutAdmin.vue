<script setup lang="ts">
import { ExternalLink, LogOut, MapPinned, Newspaper } from '@lucide/vue'
import { useRouter } from 'vue-router'
import LogoMarca from '@/components/layout/LogoMarca.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const abas = [
  { rotulo: 'Bairros e turnos', to: { name: 'admin-bairros' }, icone: MapPinned },
  { rotulo: 'Notícias', to: { name: 'admin-noticias' }, icone: Newspaper },
]

function sair() {
  auth.sair()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-svh bg-areia">
    <header class="bg-floresta text-white">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 pt-3 pb-2">
        <div class="flex items-center gap-3.5">
          <LogoMarca :tamanho="40" />
          <span class="rounded-full bg-white/15 px-2.5 py-1 text-[13px] font-bold text-[#e3eee6]">Painel</span>
        </div>
        <nav aria-label="Conta" class="flex flex-wrap items-center gap-1.5">
          <RouterLink
            :to="{ name: 'inicio' }"
            class="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-[15px] font-semibold text-[#e3eee6] hover:bg-white/10"
          >
            <ExternalLink class="size-4" aria-hidden="true" />
            Ver site
          </RouterLink>
          <span class="inline-flex min-h-11 items-center px-3 text-[15px] font-semibold">{{ auth.usuario?.nome }}</span>
          <button
            type="button"
            class="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/30 px-3.5 text-[15px] font-bold hover:bg-white/10"
            @click="sair"
          >
            <LogOut class="size-4" aria-hidden="true" />
            Sair
          </button>
        </nav>
      </div>

      <!-- Abas do painel: a ativa tem a cor do fundo da página e "encaixa" no conteúdo -->
      <nav aria-label="Seções do painel" class="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 pt-1">
        <RouterLink
          v-for="aba in abas"
          :key="aba.rotulo"
          :to="aba.to"
          class="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-t-2xl px-5 text-[15px] font-bold text-[#cfe0d5] hover:bg-white/10 hover:text-white [&.router-link-active]:bg-areia [&.router-link-active]:text-floresta"
        >
          <component :is="aba.icone" class="size-[18px]" aria-hidden="true" />
          {{ aba.rotulo }}
        </RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>
