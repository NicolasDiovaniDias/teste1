import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { normalizar } from '@/lib/texto'
import * as api from '@/services/bairrosApi'
import { mensagemDeErro } from '@/services/http'
import type { Bairro } from '@/types/coleta'

/**
 * Store dos bairros: a consulta pública e o painel leem daqui.
 * Assim, quando o admin salva um bairro, a consulta já mostra a mudança.
 */
export const useBairrosStore = defineStore('bairros', () => {
  const bairros = ref<Bairro[]>([])
  const carregando = ref(false)
  const carregou = ref(false)
  const erro = ref<string | null>(null)

  const ordenados = computed(() => [...bairros.value].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))
  const totalAtivos = computed(() => bairros.value.filter((b) => b.ativo).length)

  async function carregar(forcar = false) {
    if (carregou.value && !forcar) return
    carregando.value = true
    erro.value = null
    try {
      bairros.value = await api.listarBairros()
      carregou.value = true
    } catch (e) {
      erro.value = mensagemDeErro(e, 'Não foi possível carregar os bairros.')
    } finally {
      carregando.value = false
    }
  }

  /** Busca pelo nome e pelos outros nomes, ignorando acentos: "sao jose" encontra "São José". */
  function buscar(texto: string): Bairro[] {
    const termo = normalizar(texto)
    if (!termo) return ordenados.value
    return ordenados.value.filter((b) => [b.nome, ...(b.apelidos ?? [])].some((nome) => normalizar(nome).includes(termo)))
  }

  function porId(id: string): Bairro | undefined {
    return bairros.value.find((b) => b.id === id)
  }

  async function salvar(bairro: Bairro): Promise<Bairro> {
    const salvo = await api.salvarBairro(bairro)
    const indice = bairros.value.findIndex((b) => b.id === salvo.id)
    if (indice === -1) bairros.value.push(salvo)
    else bairros.value[indice] = salvo
    return salvo
  }

  async function excluir(id: string): Promise<void> {
    await api.excluirBairro(id)
    bairros.value = bairros.value.filter((b) => b.id !== id)
  }

  return { bairros, carregando, carregou, erro, ordenados, totalAtivos, carregar, buscar, porId, salvar, excluir }
})
