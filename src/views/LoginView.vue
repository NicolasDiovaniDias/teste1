<script setup lang="ts">
import { ArrowLeft, Check, Eye, EyeOff, LoaderCircle } from '@lucide/vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logoVertical from '@/assets/marca/coovir-vertical-branco.webp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { empresa } from '@/config'
import { CREDENCIAIS_DEMO } from '@/services/authApi'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const senha = ref('')
const senhaVisivel = ref(false)
const enviando = ref(false)
const erro = ref<string | null>(null)

// A dica com o login de teste só aparece rodando no seu computador (npm run dev)
const mostrarDemo = import.meta.env.DEV

const vantagens = [
  'Cadastre bairros e defina os dias e turnos da coleta',
  'Publique notícias e avisos para os moradores',
  'Tudo aparece no site assim que você salva',
]

async function entrar() {
  erro.value = null
  if (!email.value.trim() || !senha.value) {
    erro.value = 'Preencha o e-mail e a senha.'
    return
  }
  enviando.value = true
  try {
    await auth.entrar(email.value, senha.value)
    // Só volta para páginas do painel (evita redirecionar para sites de fora)
    const voltar = route.query.voltar
    router.replace(typeof voltar === 'string' && voltar.startsWith('/admin') ? voltar : { name: 'painel' })
  } catch (e) {
    erro.value = e instanceof Error ? e.message : 'Não foi possível entrar. Tente de novo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="flex min-h-svh flex-wrap bg-areia">
    <section class="flex min-w-0 flex-[1_1_480px] flex-col gap-10 bg-floresta px-8 py-10 text-white sm:px-12">
      <RouterLink
        :to="{ name: 'inicio' }"
        class="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-nevoa hover:text-white"
      >
        <ArrowLeft class="size-[18px]" aria-hidden="true" />
        Voltar para o site
      </RouterLink>

      <div class="my-auto flex max-w-lg flex-col gap-8">
        <img
          :src="logoVertical"
          :alt="`${empresa.nome}: ${empresa.nomeCompleto}`"
          width="640"
          height="797"
          class="h-auto w-32 sm:w-48 lg:w-56"
        />
        <div class="flex flex-col gap-5">
          <p class="text-sm font-bold text-broto">Área restrita</p>
          <h1 class="font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.05] font-extrabold tracking-tight">
            Gerencie a coleta e as notícias do <span class="text-broto">SITE.</span>
          </h1>
          <ul class="hidden flex-col gap-3.5 text-[17px] text-nevoa sm:flex">
            <li v-for="item in vantagens" :key="item" class="flex items-center gap-3">
              <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-broto">
                <Check class="size-4" stroke-width="3" aria-hidden="true" />
              </span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="flex min-w-0 flex-[1_1_480px] items-center justify-center px-6 py-12">
      <form
        class="flex w-full max-w-md flex-col gap-6 rounded-[28px] border border-linha bg-white px-7 py-10 shadow-[0_16px_40px_rgba(15,59,42,0.08)] sm:px-9"
        novalidate
        @submit.prevent="entrar"
      >
        <div class="flex flex-col gap-2">
          <h2 class="font-display text-[34px] font-extrabold tracking-tight">Entrar</h2>
          <p class="text-musgo">Acesso exclusivo da equipe da {{ empresa.nome }}.</p>
        </div>

        <p
          v-if="mostrarDemo"
          class="rounded-xl border border-dashed border-[#a9c4b3] bg-[#f1f7ec] px-4 py-3 text-sm leading-relaxed text-[#24382c]"
        >
          <strong>Teste:</strong> {{ CREDENCIAIS_DEMO.email }} / {{ CREDENCIAIS_DEMO.senha }}
        </p>

        <div class="flex flex-col gap-2">
          <Label for="email" class="text-[15px] font-bold">E-mail</Label>
          <Input
            id="email"
            v-model="email"
            type="email"
            autocomplete="username"
            placeholder="voce@empresa.com.br"
            :aria-invalid="!!erro"
            class="h-13 rounded-xl border-2 px-4 text-base md:text-base"
          />
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <Label for="senha" class="text-[15px] font-bold">Senha</Label>
            <a href="#" class="text-sm font-semibold text-folha underline-offset-4 hover:underline">Esqueci minha senha</a>
          </div>
          <div class="relative">
            <Input
              id="senha"
              v-model="senha"
              :type="senhaVisivel ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Sua senha"
              :aria-invalid="!!erro"
              class="h-13 rounded-xl border-2 pr-14 pl-4 text-base md:text-base"
            />
            <button
              type="button"
              class="absolute top-1/2 right-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-musgo hover:bg-accent"
              :aria-pressed="senhaVisivel"
              @click="senhaVisivel = !senhaVisivel"
            >
              <EyeOff v-if="senhaVisivel" class="size-5" aria-hidden="true" />
              <Eye v-else class="size-5" aria-hidden="true" />
              <span class="sr-only">{{ senhaVisivel ? 'Ocultar senha' : 'Mostrar senha' }}</span>
            </button>
          </div>
        </div>

        <p v-if="erro" role="alert" class="rounded-xl bg-[#fdecea] px-4 py-3 text-[15px] font-semibold text-[#7a1e17]">{{ erro }}</p>

        <Button type="submit" :disabled="enviando" class="h-14 rounded-xl text-[17px] font-bold">
          <LoaderCircle v-if="enviando" class="size-5 animate-spin" aria-hidden="true" />
          {{ enviando ? 'Entrando...' : 'Entrar no painel' }}
        </Button>

        <p class="text-center text-sm text-musgo">Problemas para entrar? Fale com [RESPONSÁVEL PELO SISTEMA].</p>
      </form>
    </section>
  </div>
</template>
