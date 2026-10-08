/*
 * Imagens das notícias.
 *
 * DEMONSTRAÇÃO: a foto é reduzida no navegador e salva como texto (data URL)
 * junto com a notícia. Isso ocupa espaço no navegador, então serve só para testar.
 *
 * No site real, envie o arquivo para o backend e devolva o endereço (URL) da imagem:
 *   const dados = new FormData()
 *   dados.append('imagem', arquivo)
 *   const resposta = await fetch(`${import.meta.env.VITE_API_URL}/imagens`, { method: 'POST', body: dados })
 *   if (!resposta.ok) throw new Error('Não foi possível enviar a imagem.')
 *   return (await resposta.json()).url
 */
const LARGURA_MAXIMA = 1200
const TAMANHO_MAXIMO = 15 * 1024 * 1024 // 15 MB

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
  return canvas.toDataURL('image/jpeg', 0.8)
}
