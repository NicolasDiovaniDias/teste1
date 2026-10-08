/** Erro com status HTTP e mensagem que pode ser mostrada para a pessoa. */
export class ErroHttp extends Error {
  constructor(status, mensagem, campos) {
    super(mensagem)
    this.status = status
    this.campos = campos
  }
}

// Mensagens para quando o banco recusa um dado repetido (índices únicos)
const REPETIDOS = {
  bairros_nome_unico: 'Já existe um bairro com esse nome.',
  usuarios_email_key: 'Já existe um usuário com esse e-mail.',
}

/** Último "middleware" do Express: transforma qualquer erro numa resposta JSON. */
export function tratarErros(erro, _req, res, _next) {
  if (erro instanceof ErroHttp) {
    return res.status(erro.status).json({ erro: erro.message, ...(erro.campos ? { campos: erro.campos } : {}) })
  }
  if (erro?.type === 'entity.too.large') return res.status(413).json({ erro: 'O arquivo enviado é grande demais.' })
  if (erro?.type === 'entity.parse.failed') return res.status(400).json({ erro: 'Os dados enviados estão em formato inválido.' })
  if (erro?.code === '23505') return res.status(409).json({ erro: REPETIDOS[erro.constraint] ?? 'Esse registro já existe.' })
  console.error(erro)
  res.status(500).json({ erro: 'Erro inesperado no servidor. Tente de novo.' })
}
