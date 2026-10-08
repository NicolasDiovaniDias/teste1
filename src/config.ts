/**
 * Dados da empresa e ajustes gerais do site.
 * Troque os textos entre colchetes pelos dados reais do cliente.
 */
export const empresa = {
  /** Nome curto, usado no cabeçalho, nos títulos das páginas e no rodapé */
  nome: 'COOVIR',
  /** Nome completo, como aparece na logo */
  nomeCompleto: 'Cooperativa de Trabalho Viamonense de Catadores e Recicladores',
  /** Confirmar com o cliente (veio do "Viamonense" do nome) */
  cidade: 'Viamão',
  whatsapp: '[WHATSAPP]',
  /** Link do WhatsApp, ex.: 'https://wa.me/5551999999999'. Vazio = rola até o rodapé. */
  whatsappLink: '',
  email: '[E-MAIL]',
  endereco: '[ENDEREÇO]',
}

/** Números da faixa da home. Use só dados que o cliente confirmar. */
export const numeros = [
  { valor: '[XX] t', rotulo: 'de recicláveis coletados por mês' },
  { valor: '[XX]', rotulo: 'bairros atendidos' },
  { valor: '[XX] anos', rotulo: 'de coleta seletiva na cidade' },
  { valor: '[XX]', rotulo: 'pessoas trabalhando na triagem' },
]

export const mapa = {
  /**
   * true = mostra as ruas do OpenStreetMap por baixo dos bairros.
   * Deixe false enquanto os bairros forem os de exemplo (as áreas são fictícias).
   */
  mostrarRuas: false,
}
