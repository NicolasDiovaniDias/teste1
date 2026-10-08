import { ref } from 'vue'

/**
 * Pede a localização do celular/computador (o navegador mostra um aviso de permissão).
 * Funciona só em https:// ou em localhost.
 */
export function useLocalizacao() {
  const buscando = ref(false)
  const erro = ref<string | null>(null)

  function localizar(): Promise<{ lat: number; lng: number } | null> {
    erro.value = null
    if (!('geolocation' in navigator)) {
      erro.value = 'Seu navegador não permite usar a localização. Escolha o bairro pela lista.'
      return Promise.resolve(null)
    }
    buscando.value = true
    return new Promise((resolver) => {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          buscando.value = false
          resolver({ lat: posicao.coords.latitude, lng: posicao.coords.longitude })
        },
        (falha) => {
          buscando.value = false
          erro.value =
            falha.code === falha.PERMISSION_DENIED
              ? 'Você não permitiu o uso da localização. Escolha o bairro pela lista.'
              : 'Não conseguimos achar sua localização agora. Escolha o bairro pela lista.'
          resolver(null)
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      )
    })
  }

  return { buscando, erro, localizar }
}
