-- =====================================================================
-- Banco de dados do site da COOVIR (PostgreSQL 13 ou mais novo)
--
-- Pode rodar mais de uma vez: só cria o que ainda não existe.
-- Para rodar: npm run db:criar (dentro da pasta api), ou cole este
-- arquivo no editor SQL do serviço onde o banco está hospedado.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Bairros (e outros locais da rota: vilas, estradas, becos, trechos da RS-040)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bairros (
  -- Identificador usado na URL do site, ex.: "jardim-universitario"
  id            text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nome          text NOT NULL CHECK (char_length(nome) BETWEEN 1 AND 120),
  -- false = aparece no site como "sem coleta seletiva"
  ativo         boolean NOT NULL DEFAULT true,
  -- Outros nomes do mesmo lugar. Ajudam a busca por CEP e por rua,
  -- que recebem o nome do bairro escrito do jeito dos Correios.
  apelidos      text[] NOT NULL DEFAULT '{}',
  -- Limites do bairro no mapa (GeoJSON do tipo Polygon ou MultiPolygon)
  area          jsonb,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

-- Não deixa cadastrar dois bairros com o mesmo nome (sem diferenciar maiúsculas)
CREATE UNIQUE INDEX IF NOT EXISTS bairros_nome_unico ON bairros (lower(nome));

-- ---------------------------------------------------------------------
-- Turnos de coleta de cada bairro
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS turnos (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  bairro_id text NOT NULL REFERENCES bairros (id) ON DELETE CASCADE ON UPDATE CASCADE,
  -- 0 = domingo, 1 = segunda ... 6 = sábado
  dia       smallint NOT NULL CHECK (dia BETWEEN 0 AND 6),
  periodo   text NOT NULL CHECK (periodo IN ('manha', 'tarde', 'noite')),
  -- Horários são opcionais: a planilha da cooperativa só informa manhã ou tarde
  inicio    time,
  fim       time,
  CHECK (fim IS NULL OR inicio IS NOT NULL),
  CHECK (inicio IS NULL OR fim IS NULL OR fim > inicio)
);

CREATE INDEX IF NOT EXISTS turnos_bairro_idx ON turnos (bairro_id);

-- ---------------------------------------------------------------------
-- Notícias
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS noticias (
  -- Identificador usado na URL, ex.: "como-separar-o-lixo-reciclavel-em-casa"
  id               text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titulo           text NOT NULL CHECK (char_length(titulo) BETWEEN 1 AND 120),
  resumo           text NOT NULL CHECK (char_length(resumo) BETWEEN 1 AND 200),
  -- Texto puro: uma linha em branco separa os parágrafos
  conteudo         text NOT NULL CHECK (char_length(conteudo) >= 1),
  -- Endereço da imagem de capa, ex.: /api/imagens/<id>
  imagem           text,
  imagem_descricao text,
  publicada_em     date NOT NULL DEFAULT current_date,
  -- false = rascunho (só aparece no painel)
  publicada        boolean NOT NULL DEFAULT false,
  atualizado_em    timestamptz NOT NULL DEFAULT now()
);

-- Deixa rápida a lista de notícias publicadas, da mais nova para a mais antiga
CREATE INDEX IF NOT EXISTS noticias_publicadas_idx ON noticias (publicada_em DESC) WHERE publicada;

-- ---------------------------------------------------------------------
-- Imagens das notícias (guardadas no próprio banco: não somem a cada deploy)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS imagens (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo      text NOT NULL CHECK (tipo IN ('image/jpeg', 'image/png', 'image/webp')),
  dados     bytea NOT NULL,
  criada_em timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Usuários do painel e sessões de login
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome       text NOT NULL,
  email      text NOT NULL UNIQUE CHECK (email = lower(email)),
  -- Senha nunca é salva: só o resultado do scrypt (veja api/src/lib/senhas.js)
  senha_hash text NOT NULL,
  criado_em  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessoes (
  -- Hash SHA-256 do token guardado no cookie (o token em si não fica no banco)
  token_hash text PRIMARY KEY,
  usuario_id bigint NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  criada_em  timestamptz NOT NULL DEFAULT now(),
  expira_em  timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS sessoes_expira_idx ON sessoes (expira_em);
