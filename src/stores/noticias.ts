import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { estaNoAr, ordenarNoticias } from '@/lib/noticias'
import { mensagemDeErro } from '@/services/http'
import * as api from '@/services/noticiasApi'
import type { Noticia } from '@/types/noticia'
import { useAuthStore } from './auth'

/**
 * Store das notícias: a home, a página de notícias e o painel leem daqui.
 * Logado, carrega todas (com rascunhos); sem login, só as que estão no ar.
 */
export const useNoticiasStore = defineStore('noticias', () => {
  const auth = useAuthStore()
  const noticias = ref<Noticia[]>([])
  const carregando = ref(false)
  const carregou = ref(false)
  const erro = ref<string | null>(null)

  /** Todas, mais recentes primeiro (usado no painel) */
  const ordenadas = computed(() => ordenarNoticias(noticias.value))
  /** Só as que aparecem no site */
  const publicadas = computed(() => ordenadas.value.filter((n) => estaNoAr(n)))

  let carregadasComoAdmin = false
  // Se duas telas pedirem os dados ao mesmo tempo, as duas esperam o mesmo pedido
  let pedido: Promise<void> | null = null

  function carregar(forcar = false): Promise<void> {
    const admin = auth.logado
    if (carregou.value && !forcar && admin === carregadasComoAdmin) return Promise.resolve()
    if (pedido) return pedido
    pedido = (async () => {
      carregando.value = true
      erro.value = null
      try {
        noticias.value = admin ? await api.listarTodasNoticias() : await api.listarNoticiasPublicadas()
        carregadasComoAdmin = admin
        carregou.value = true
      } catch (e) {
        erro.value = mensagemDeErro(e, 'Não foi possível carregar as notícias.')
      } finally {
        carregando.value = false
        pedido = null
      }
    })()
    return pedido
  }

  function porId(id: string): Noticia | undefined {
    return noticias.value.find((n) => n.id === id)
  }

  async function salvar(noticia: Noticia): Promise<Noticia> {
    const salva = await api.salvarNoticia(noticia)
    const indice = noticias.value.findIndex((n) => n.id === salva.id)
    if (indice === -1) noticias.value.push(salva)
    else noticias.value[indice] = salva
    return salva
  }

  async function excluir(id: string): Promise<void> {
    await api.excluirNoticia(id)
    noticias.value = noticias.value.filter((n) => n.id !== id)
  }

  return { noticias, carregando, carregou, erro, ordenadas, publicadas, carregar, porId, salvar, excluir }
})
