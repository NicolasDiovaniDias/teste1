<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <a
    href="#conteudo"
    class="sr-only z-50 rounded-lg bg-broto px-4 py-3 font-bold text-floresta focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
  >
    Pular para o conteúdo
  </a>
  <AppHeader />
  <main id="conteudo" tabindex="-1" class="outline-none">
    <RouterView />
  </main>
  <AppFooter />
</template>
