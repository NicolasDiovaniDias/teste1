import { api } from './http'

/*
 * Imagens das notícias: a foto é reduzida aqui no navegador (até 1200 px de
 * largura, em JPG) e enviada para a API, que guarda no banco e devolve o
 * endereço da imagem, ex.: /api/imagens/<id>.
 */
const LARGURA_MAXIMA = 1200
const TAMANHO_MAXIMO = 15 * 1024 * 1024 // 15 MB

function paraBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolver, rejeitar) => {
    canvas.toBlob((blob) => (blob ? resolver(blob) : rejeitar(new Error('Não foi possível preparar a imagem.'))), 'image/jpeg', 0.82)
  })
}

export async function enviarImagem(arquivo: File): Promise<string> {
  if (!arquivo.type.startsWith('image/')) {
    throw new Error('Escolha um arquivo de imagem (JPG, PNG ou WebP).')
  }
  if (arquivo.size > TAMANHO_MAXIMO) {
    throw new Error('A imagem passa de 15 MB. Escolha uma menor.')
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(arquivo)
  } catch {
    throw new Error('Não foi possível abrir essa imagem. Tente outra, em JPG ou PNG.')
  }

  const escala = Math.min(1, LARGURA_MAXIMA / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * escala)
  canvas.height = Math.round(bitmap.height * escala)
  const contexto = canvas.getContext('2d')
  if (!contexto) throw new Error('Seu navegador não conseguiu preparar a imagem.')

  // Fundo branco: o JPG não tem transparência (sem isso, PNG transparente fica preto)
  contexto.fillStyle = '#ffffff'
  contexto.fillRect(0, 0, canvas.width, canvas.height)
  contexto.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const { url } = await api<{ url: string }>('/imagens', {
    method: 'POST',
    corpo: await paraBlob(canvas),
    headers: { 'Content-Type': 'image/jpeg' },
  })
  return url
}
