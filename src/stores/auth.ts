import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as api from '@/services/authApi'
import type { Usuario } from '@/services/authApi'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>(null)
  const logado = computed(() => usuario.value !== null)

  let verificacao: Promise<void> | null = null

  /** Pergunta ao servidor se já existe uma sessão aberta (só na primeira vez). */
  function verificar(): Promise<void> {
    verificacao ??= api
      .sessaoAtual()
      .then((resposta) => {
        usuario.value = resposta.usuario
      })
      .catch(() => {
        usuario.value = null
      })
    return verificacao
  }

  async function entrar(email: string, senha: string) {
    const resposta = await api.entrar(email, senha)
    usuario.value = resposta.usuario
  }

  async function sair() {
    try {
      await api.sair()
    } finally {
      usuario.value = null
    }
  }

  return { usuario, logado, verificar, entrar, sair }
})
