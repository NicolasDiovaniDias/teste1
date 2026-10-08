import { z } from 'zod'
import { ErroHttp } from './erros.js'

/** Confere os dados com o "schema" e devolve já limpos, ou responde 400 com a mensagem. */
export function validar(schema, dados) {
  const resultado = schema.safeParse(dados)
  if (!resultado.success) {
    const campos = {}
    for (const problema of resultado.error.issues) campos[problema.path.join('.') || 'geral'] ??= problema.message
    throw new ErroHttp(400, resultado.error.issues[0]?.message ?? 'Dados inválidos.', campos)
  }
  return resultado.data
}

export const idSchema = z
  .string()
  .max(100, 'Identificador grande demais.')
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Identificador inválido.')

const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use o horário no formato HH:MM.')

export const turnoSchema = z
  .object({
    dia: z.number().int().min(0).max(6),
    periodo: z.enum(['manha', 'tarde', 'noite']),
    inicio: hora.optional(),
    fim: hora.optional(),
  })
  .refine((turno) => !(turno.fim && !turno.inicio), 'Informe também o horário de início.')
  .refine((turno) => !(turno.inicio && turno.fim && turno.fim <= turno.inicio), 'O fim precisa ser depois do início.')

export const bairroSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome do bairro.').max(120, 'Use até 120 caracteres no nome.'),
  ativo: z.boolean(),
  apelidos: z.array(z.string().trim().min(1).max(120)).max(20, 'Use até 20 outros nomes.').default([]),
  turnos: z.array(turnoSchema).max(50),
  area: z
    .object({ type: z.enum(['Polygon', 'MultiPolygon']), coordinates: z.array(z.any()) })
    .nullable()
    .optional(),
})

export const noticiaSchema = z.object({
  titulo: z.string().trim().min(1, 'Informe o título da notícia.').max(120, 'Use até 120 caracteres no título.'),
  resumo: z.string().trim().min(1, 'Escreva um resumo curto.').max(200, 'Use até 200 caracteres no resumo.'),
  conteudo: z.string().trim().min(1, 'Escreva o texto da notícia.').max(20000, 'O texto está grande demais.'),
  // Só aceita imagens enviadas para esta API (nada de endereços externos ou "javascript:")
  imagem: z
    .string()
    .regex(/^\/api\/imagens\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, 'Imagem inválida.')
    .optional(),
  imagemDescricao: z.string().trim().max(200, 'Use até 200 caracteres na descrição.').optional(),
  publicadaEm: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe a data de publicação.'),
  publicada: z.boolean(),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Informe o e-mail.'),
  senha: z.string().min(1, 'Informe a senha.'),
})
