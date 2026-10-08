import { diasAPartirDeHoje } from '@/lib/datas'
import type { Noticia } from '@/types/noticia'

/*
 * NOTÍCIAS DE EXEMPLO, só para ver o layout funcionando.
 * Os trechos entre colchetes precisam de informação real da cooperativa.
 * Antes de publicar o site, edite ou exclua estas notícias pelo painel.
 * As datas são calculadas a partir de hoje, para o exemplo sempre parecer recente.
 */
const ATUALIZADO = new Date().toISOString()

export const NOTICIAS_EXEMPLO: Noticia[] = [
  {
    id: 'coleta-seletiva-comeca-a-atender-novo-bairro',
    titulo: 'Coleta seletiva começa a atender [BAIRRO]',
    resumo:
      'A partir de [DATA], os moradores do bairro passam a ter coleta seletiva porta a porta. Veja como separar e em que dia colocar o material na calçada.',
    conteudo: [
      'A partir de [DATA], a coleta seletiva da COOVIR passa a atender o bairro [BAIRRO]. A equipe vai passar [DIA E TURNO], recolhendo os recicláveis porta a porta.',
      'Para participar, separe papel, plástico, vidro e metal do lixo orgânico e coloque tudo na calçada no dia da coleta, em sacos bem fechados.',
      'Os dias e turnos de todos os bairros atendidos estão na página Consultar meu bairro.',
    ].join('\n\n'),
    publicadaEm: diasAPartirDeHoje(-1),
    publicada: true,
    atualizadoEm: ATUALIZADO,
  },
  {
    id: 'como-separar-o-lixo-reciclavel-em-casa',
    titulo: 'Como separar o lixo reciclável em casa',
    resumo: 'Um guia rápido para separar os recicláveis sem complicação e facilitar o trabalho de quem faz a triagem.',
    conteudo: [
      'Separar o lixo em casa é simples: basta ter um lugar para os recicláveis secos e outro para o lixo orgânico e os rejeitos.',
      'Recicláveis secos são papel, papelão, plástico, vidro e metal. Dê uma enxaguada nas embalagens com restos de comida e mantenha papel e papelão secos.',
      'Restos de comida, papel higiênico, fraldas e guardanapos usados vão para a coleta comum. Pilhas, lâmpadas, eletrônicos e óleo de cozinha precisam ir para pontos de entrega.',
      'Material limpo e bem separado chega inteiro à triagem e pode ser vendido para a reciclagem, o que gera trabalho e renda para os cooperados.',
    ].join('\n\n'),
    publicadaEm: diasAPartirDeHoje(-9),
    publicada: true,
    atualizadoEm: ATUALIZADO,
  },
  {
    id: 'conheca-a-coovir',
    titulo: 'Conheça a COOVIR',
    resumo:
      'A Cooperativa de Trabalho Viamonense de Catadores e Recicladores reúne quem trabalha com materiais recicláveis em Viamão.',
    conteudo: [
      'A COOVIR, Cooperativa de Trabalho Viamonense de Catadores e Recicladores, reúne catadores e recicladores que trabalham com materiais recicláveis em Viamão.',
      'Depois da coleta, o material é separado por tipo, prensado e vendido para a indústria, que o transforma em matéria-prima para novos produtos.',
      '[HISTÓRIA DA COOPERATIVA: ANO DE FUNDAÇÃO, QUANTAS PESSOAS TRABALHAM NELA, CONQUISTAS]',
    ].join('\n\n'),
    publicadaEm: diasAPartirDeHoje(-21),
    publicada: true,
    atualizadoEm: ATUALIZADO,
  },
  {
    id: 'coleta-nos-feriados-de-fim-de-ano',
    titulo: 'Como fica a coleta nos feriados de fim de ano',
    resumo: 'Confira se a coleta seletiva passa no Natal e no Ano-Novo e o que fazer se o dia do seu bairro cair num feriado.',
    conteudo: [
      'Nos feriados de [DATAS], a coleta seletiva [FUNCIONA NORMALMENTE / NÃO PASSA / PASSA NO DIA SEGUINTE].',
      'Se a coleta do seu bairro cair num feriado, [ORIENTAÇÃO DA COOPERATIVA].',
      'Em caso de dúvida, fale com a gente pelo [WHATSAPP].',
    ].join('\n\n'),
    publicadaEm: diasAPartirDeHoje(0),
    publicada: false, // rascunho: aparece só no painel
    atualizadoEm: ATUALIZADO,
  },
]
