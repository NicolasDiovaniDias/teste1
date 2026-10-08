<script setup lang="ts">
import ChamadaConsulta from '@/components/home/ChamadaConsulta.vue'
import ComoFunciona from '@/components/home/ComoFunciona.vue'
import DestinoResiduos from '@/components/home/DestinoResiduos.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import MateriaisSection from '@/components/home/MateriaisSection.vue'
import NoticiasRecentes from '@/components/home/NoticiasRecentes.vue'
import NumerosSection from '@/components/home/NumerosSection.vue'
import PerguntasFrequentes from '@/components/home/PerguntasFrequentes.vue'
import { useNoticiasStore } from '@/stores/noticias'

const noticias = useNoticiasStore()
</script>

<template>
  <HeroSection />
  <NumerosSection />
  <ComoFunciona />
  <MateriaisSection />
  <DestinoResiduos />
  <NoticiasRecentes />
  <!-- Com notícias, a seção de cima é branca, então a chamada precisa de espaço em cima também -->
  <ChamadaConsulta :class="{ 'pt-24': noticias.publicadas.length > 0 }" />
  <PerguntasFrequentes />
</template>
