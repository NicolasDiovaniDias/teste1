-- =====================================================================
-- Carga inicial do banco da COOVIR
--
-- Bairros e turnos transcritos do PDF "rotas para divulgação 06.26"
-- (planilha "2026 AGENDAMENTO / ROTAS / COLETAS", junho de 2026).
-- A planilha não tem horários, só manhã e tarde.
--
-- Itens com dois lugares ("Centro / Dom Feliciano") viraram um registro
-- para cada lugar, com o mesmo turno. Revise com a cooperativa:
--   * "Recanto" (quarta de manhã, junto com Residencial Figueira) ficou
--     como um local separado porque o nome está incompleto no PDF.
--   * "Beco / Recanto da Lagoa" (sexta à tarde) virou "Recanto da Lagoa".
--   * "Acrísio Prates via RS 118" virou "Acrísio Prates".
--   * Grafias corrigidas: Sítio, Águas Claras, Querência, Cecília, Ipê,
--     Pró-Morar e Santa Isabel ("Santa Izabel" ficou como apelido).
--
-- Só roda se o banco estiver vazio, para não apagar o que já foi
-- cadastrado pelo painel.
-- =====================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM bairros) THEN
    RAISE NOTICE 'Já existem bairros cadastrados: a carga de bairros foi pulada.';
    RETURN;
  END IF;

  INSERT INTO bairros (id, nome, apelidos) VALUES
    ('acorianos', 'Açorianos', '{}'),
    ('acrisio-prates', 'Acrísio Prates', '{}'),
    ('aguas-claras', 'Águas Claras', '{}'),
    ('augustas', 'Augustas', '{}'),
    ('beco-do-soares', 'Beco do Soares', '{}'),
    ('beco-dos-botinhas', 'Beco dos Botinhas', '{}'),
    ('beco-dos-cunhas', 'Beco dos Cunhas', '{}'),
    ('beco-dos-gutierres', 'Beco dos Gutierres', '{}'),
    ('beira-lago', 'Beira Lago', '{}'),
    ('branquinha', 'Branquinha', '{}'),
    ('caminho-do-meio', 'Caminho do Meio', '{}'),
    ('cantagalo', 'Cantagalo', '{}'),
    ('capao-da-porteira', 'Capão da Porteira', '{}'),
    ('capororoca', 'Capororoca', '{}'),
    ('cecilia', 'Cecília', '{}'),
    ('centro', 'Centro', '{}'),
    ('cinturao-azul', 'Cinturão Azul', '{}'),
    ('cohab', 'Cohab', '{}'),
    ('complexo-taruma', 'Complexo Tarumã', '{}'),
    ('dom-feliciano', 'Dom Feliciano', '{}'),
    ('esmeralda', 'Esmeralda', '{}'),
    ('estalagem', 'Estalagem', '{}'),
    ('estancia-grande', 'Estância Grande', '{}'),
    ('estrada-assis-brasil', 'Estrada Assis Brasil', '{}'),
    ('estrada-capitao-gentil-de-godoy', 'Estrada Capitão Gentil de Godoy', '{}'),
    ('eta', 'ETA', '{}'),
    ('florenca', 'Florença', '{}'),
    ('florescente', 'Florescente', '{}'),
    ('gaucha', 'Gaúcha', '{}'),
    ('ipe', 'Ipê', '{}'),
    ('jardim-fiuza', 'Jardim Fiúza', '{}'),
    ('jardim-universitario', 'Jardim Universitário', '{}'),
    ('jardim-viamar', 'Jardim Viamar', '{}'),
    ('jari', 'Jari', '{}'),
    ('julia', 'Júlia', '{}'),
    ('krahe', 'Krahe', '{}'),
    ('lisboa', 'Lisboa', '{}'),
    ('lomba-taruma', 'Lomba Tarumã', '{}'),
    ('manoel-santana', 'Manoel Santana', '{}'),
    ('mendanha', 'Mendanha', '{}'),
    ('monte-alegre', 'Monte Alegre', '{}'),
    ('novo-horizonte', 'Novo Horizonte', '{}'),
    ('parque-casa-grande', 'Parque Casa Grande', '{}'),
    ('parque-de-itapua', 'Parque de Itapuã', '{}'),
    ('parque-florestal', 'Parque Florestal', '{}'),
    ('passo-do-vigario', 'Passo do Vigário', '{}'),
    ('passo-dos-negros', 'Passo dos Negros', '{}'),
    ('planalto', 'Planalto', '{}'),
    ('pro-morar', 'Pró-Morar', '{}'),
    ('querencia', 'Querência', '{}'),
    ('recanto', 'Recanto', '{}'),
    ('recanto-da-lagoa', 'Recanto da Lagoa', '{}'),
    ('residencial-figueira', 'Residencial Figueira', '{}'),
    ('rs-040-ate-parada-94', 'RS-040 (até a parada 94)', '{}'),
    ('rs-040-centro-ate-santa-isabel', 'RS-040 (Centro até Santa Isabel)', '{}'),
    ('rs-040-parada-63-ate-140', 'RS-040 (parada 63 até 140)', '{}'),
    ('rs-118', 'RS-118', '{}'),
    ('santa-isabel', 'Santa Isabel', '{"Santa Izabel"}'),
    ('sao-lucas', 'São Lucas', '{}'),
    ('sao-tome', 'São Tomé', '{}'),
    ('sepe-tiaraju', 'Sepé Tiarajú', '{}'),
    ('sitio-sao-jose', 'Sítio São José', '{}'),
    ('taruma', 'Tarumã', '{}'),
    ('universal', 'Universal', '{}'),
    ('valenca', 'Valença', '{}'),
    ('viamopolis', 'Viamópolis', '{}'),
    ('vila-de-itapua', 'Vila de Itapuã', '{}'),
    ('vila-elsa', 'Vila Elsa', '{}'),
    ('vila-helenita', 'Vila Helenita', '{}');

  -- dia: 1 = segunda, 2 = terça, 3 = quarta, 4 = quinta, 5 = sexta
  INSERT INTO turnos (bairro_id, dia, periodo)
  SELECT v.bairro_id, v.dia, v.periodo
  FROM (VALUES
    -- Segunda de manhã
    ('centro', 1, 'manha'), ('dom-feliciano', 1, 'manha'), ('sitio-sao-jose', 1, 'manha'),
    ('pro-morar', 1, 'manha'), ('krahe', 1, 'manha'), ('santa-isabel', 1, 'manha'),
    ('beira-lago', 1, 'manha'), ('jardim-universitario', 1, 'manha'), ('jari', 1, 'manha'),
    ('rs-040-parada-63-ate-140', 1, 'manha'), ('aguas-claras', 1, 'manha'),
    ('rs-040-centro-ate-santa-isabel', 1, 'manha'),
    -- Terça de manhã
    ('centro', 2, 'manha'), ('taruma', 2, 'manha'), ('ipe', 2, 'manha'),
    ('complexo-taruma', 2, 'manha'), ('sao-lucas', 2, 'manha'), ('beco-do-soares', 2, 'manha'),
    ('sepe-tiaraju', 2, 'manha'), ('esmeralda', 2, 'manha'), ('gaucha', 2, 'manha'),
    ('acrisio-prates', 2, 'manha'), ('parque-florestal', 2, 'manha'),
    ('rs-040-centro-ate-santa-isabel', 2, 'manha'),
    -- Quarta de manhã
    ('valenca', 3, 'manha'), ('centro', 3, 'manha'), ('sitio-sao-jose', 3, 'manha'),
    ('pro-morar', 3, 'manha'), ('krahe', 3, 'manha'), ('dom-feliciano', 3, 'manha'),
    ('viamopolis', 3, 'manha'), ('beco-dos-cunhas', 3, 'manha'), ('recanto', 3, 'manha'),
    ('residencial-figueira', 3, 'manha'), ('rs-040-ate-parada-94', 3, 'manha'),
    ('rs-040-centro-ate-santa-isabel', 3, 'manha'),
    -- Quinta de manhã
    ('centro', 4, 'manha'), ('taruma', 4, 'manha'), ('ipe', 4, 'manha'),
    ('complexo-taruma', 4, 'manha'), ('sao-lucas', 4, 'manha'), ('beco-do-soares', 4, 'manha'),
    ('sepe-tiaraju', 4, 'manha'), ('esmeralda', 4, 'manha'), ('gaucha', 4, 'manha'),
    ('capororoca', 4, 'manha'), ('planalto', 4, 'manha'), ('florescente', 4, 'manha'),
    ('rs-040-centro-ate-santa-isabel', 4, 'manha'),
    -- Sexta de manhã
    ('jardim-viamar', 5, 'manha'), ('rs-118', 5, 'manha'), ('jardim-fiuza', 5, 'manha'),
    ('valenca', 5, 'manha'), ('passo-dos-negros', 5, 'manha'), ('estancia-grande', 5, 'manha'),
    ('cinturao-azul', 5, 'manha'), ('sitio-sao-jose', 5, 'manha'), ('vila-elsa', 5, 'manha'),
    ('vila-helenita', 5, 'manha'), ('estrada-capitao-gentil-de-godoy', 5, 'manha'),
    ('santa-isabel', 5, 'manha'), ('beira-lago', 5, 'manha'), ('jardim-universitario', 5, 'manha'),
    ('rs-040-centro-ate-santa-isabel', 5, 'manha'),
    -- Segunda à tarde
    ('centro', 1, 'tarde'), ('lisboa', 1, 'tarde'), ('querencia', 1, 'tarde'),
    ('cohab', 1, 'tarde'), ('cecilia', 1, 'tarde'), ('jari', 1, 'tarde'),
    ('monte-alegre', 1, 'tarde'), ('beco-dos-botinhas', 1, 'tarde'), ('beco-dos-gutierres', 1, 'tarde'),
    ('capao-da-porteira', 1, 'tarde'), ('eta', 1, 'tarde'), ('passo-do-vigario', 1, 'tarde'),
    -- Terça à tarde
    ('centro', 2, 'tarde'), ('estalagem', 2, 'tarde'), ('lomba-taruma', 2, 'tarde'),
    ('mendanha', 2, 'tarde'), ('parque-casa-grande', 2, 'tarde'), ('acorianos', 2, 'tarde'),
    ('vila-de-itapua', 2, 'tarde'), ('cantagalo', 2, 'tarde'), ('parque-de-itapua', 2, 'tarde'),
    ('rs-040-centro-ate-santa-isabel', 2, 'tarde'),
    -- Quarta à tarde
    ('centro', 3, 'tarde'), ('caminho-do-meio', 3, 'tarde'), ('estrada-assis-brasil', 3, 'tarde'),
    ('novo-horizonte', 3, 'tarde'), ('lisboa', 3, 'tarde'), ('querencia', 3, 'tarde'),
    ('cecilia', 3, 'tarde'), ('santa-isabel', 3, 'tarde'),
    ('rs-040-centro-ate-santa-isabel', 3, 'tarde'),
    -- Quinta à tarde
    ('centro', 4, 'tarde'), ('estalagem', 4, 'tarde'), ('lomba-taruma', 4, 'tarde'),
    ('mendanha', 4, 'tarde'), ('parque-casa-grande', 4, 'tarde'), ('acorianos', 4, 'tarde'),
    ('universal', 4, 'tarde'), ('manoel-santana', 4, 'tarde'), ('acrisio-prates', 4, 'tarde'),
    ('branquinha', 4, 'tarde'), ('sao-tome', 4, 'tarde'),
    ('rs-040-centro-ate-santa-isabel', 4, 'tarde'),
    -- Sexta à tarde
    ('centro', 5, 'tarde'), ('recanto-da-lagoa', 5, 'tarde'), ('residencial-figueira', 5, 'tarde'),
    ('lisboa', 5, 'tarde'), ('querencia', 5, 'tarde'), ('cecilia', 5, 'tarde'),
    ('florenca', 5, 'tarde'), ('augustas', 5, 'tarde'), ('jari', 5, 'tarde'), ('julia', 5, 'tarde'),
    ('rs-040-centro-ate-santa-isabel', 5, 'tarde')
  ) AS v (bairro_id, dia, periodo);
END $$;

-- ---------------------------------------------------------------------
-- Notícias iniciais. Só a de "como separar" vai publicada; as outras
-- ficam como rascunho porque têm trechos entre colchetes para completar.
-- ---------------------------------------------------------------------
DO $$
DECLARE
  hoje date := (now() AT TIME ZONE 'America/Sao_Paulo')::date;
BEGIN
  IF EXISTS (SELECT 1 FROM noticias) THEN
    RAISE NOTICE 'Já existem notícias cadastradas: a carga de notícias foi pulada.';
    RETURN;
  END IF;

  INSERT INTO noticias (id, titulo, resumo, conteudo, publicada_em, publicada) VALUES
  (
    'como-separar-o-lixo-reciclavel-em-casa',
    'Como separar o lixo reciclável em casa',
    'Um guia rápido para separar os recicláveis sem complicação e facilitar o trabalho de quem faz a triagem.',
    E'Separar o lixo em casa é simples: basta ter um lugar para os recicláveis secos e outro para o lixo orgânico e os rejeitos.\n\n'
    'Recicláveis secos são papel, papelão, plástico, vidro e metal. Dê uma enxaguada nas embalagens com restos de comida e mantenha papel e papelão secos.\n\n'
    'Restos de comida, papel higiênico, fraldas e guardanapos usados vão para a coleta comum. Pilhas, lâmpadas, eletrônicos e óleo de cozinha precisam ir para pontos de entrega.\n\n'
    'Material limpo e bem separado chega inteiro à triagem e pode ser vendido para a reciclagem, o que gera trabalho e renda para os cooperados.',
    hoje,
    true
  ),
  (
    'conheca-a-coovir',
    'Conheça a COOVIR',
    'A Cooperativa de Trabalho Viamonense de Catadores e Recicladores reúne quem trabalha com materiais recicláveis em Viamão.',
    E'A COOVIR, Cooperativa de Trabalho Viamonense de Catadores e Recicladores, reúne catadores e recicladores que trabalham com materiais recicláveis em Viamão.\n\n'
    'Depois da coleta, o material é separado por tipo, prensado e vendido para a indústria, que o transforma em matéria-prima para novos produtos.\n\n'
    '[HISTÓRIA DA COOPERATIVA: ANO DE FUNDAÇÃO, QUANTAS PESSOAS TRABALHAM NELA, CONQUISTAS]',
    hoje,
    false
  ),
  (
    'coleta-nos-feriados-de-fim-de-ano',
    'Como fica a coleta nos feriados de fim de ano',
    'Confira se a coleta seletiva passa no Natal e no Ano-Novo e o que fazer se o dia do seu bairro cair num feriado.',
    E'Nos feriados de [DATAS], a coleta seletiva [FUNCIONA NORMALMENTE / NÃO PASSA / PASSA NO DIA SEGUINTE].\n\n'
    'Se a coleta do seu bairro cair num feriado, [ORIENTAÇÃO DA COOPERATIVA].\n\n'
    'Em caso de dúvida, fale com a gente pelo [WHATSAPP].',
    hoje,
    false
  );
END $$;
