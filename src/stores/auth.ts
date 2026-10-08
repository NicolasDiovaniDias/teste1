import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import * as api from '@/services/authApi'
import type { Usuario } from '@/services/authApi'

export const useAuthStore = defineStore('auth', () => {
  // Fica salvo só enquanto a aba estiver aberta (demonstração)
  const usuario = useSessionStorage<Usuario | null>('coleta-seletiva:usuario', null, {
    serializer: StorageSerializers.object,
  })

  const logado = computed(() => usuario.value !== null)

  async function entrar(email: string, senha: string) {
    usuario.value = await api.entrar(email, senha)
  }

  function sair() {
    usuario.value = null
  }

  return { usuario, logado, entrar, sair }
})
