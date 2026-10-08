import { empresa } from '@/config'

export const PERGUNTAS = [
  {
    pergunta: 'Preciso separar cada material num saco diferente?',
    resposta:
      'Não precisa: junte todos os recicláveis secos no mesmo saco, separados do lixo orgânico. A separação por tipo é feita na triagem. [CONFIRMAR COM A EMPRESA]',
  },
  {
    pergunta: 'Preciso lavar as embalagens?',
    resposta:
      'Não precisa deixar brilhando. Uma enxaguada para tirar os restos de comida já basta: isso evita mau cheiro e mantém o valor do material.',
  },
  {
    pergunta: 'Meu bairro não aparece na consulta. E agora?',
    resposta: `Pode ser que a coleta seletiva ainda não chegue até aí. Fale com a gente pelo ${empresa.whatsapp} informando sua rua e bairro.`,
  },
  {
    pergunta: 'A coleta passa em feriados?',
    resposta: '[REGRA DE FERIADOS DA EMPRESA]',
  },
  {
    pergunta: 'Onde descarto pilhas, lâmpadas e eletrônicos?',
    resposta:
      'Esses resíduos não vão na coleta seletiva. Devolva no comércio onde comprou ou leve a um ponto de entrega de logística reversa: [PONTOS DE ENTREGA].',
  },
]
