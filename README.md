# Site da COOVIR: coleta seletiva

Site da COOVIR (Cooperativa de Trabalho Viamonense de Catadores e Recicladores): home explicativa, consulta da coleta pelo CEP, pela rua ou pelo bairro, notícias e painel do administrador.

O projeto tem duas partes:

- **Front-end** (raiz do projeto): Vite + Vue. É o que aparece no navegador.
- **Back-end** (pasta `api/`): Node + Express + Postgres. Guarda bairros, turnos, notícias, imagens e usuários do painel, confere o login e faz a busca de CEP e rua.

## Como rodar no seu computador

Precisa do [Node.js](https://nodejs.org) 22.12 ou mais novo e de um banco Postgres. Sem permissão de administrador, o mais simples é criar o banco na nuvem:

1. **Banco:** crie um Postgres no [Render](https://render.com) (o gratuito é apagado depois de 30 dias; o pago começa em US$ 6 por mês) ou em outro serviço de Postgres. Copie a **External Database URL**.
2. **API** (num terminal, dentro da pasta `api`):

   ```powershell
   cd api
   Copy-Item .env.exemplo .env   # no Linux/Mac: cp .env.exemplo .env
   ```

   Abra o `.env` e cole o endereço do banco em `DATABASE_URL`, com `?sslmode=verify-full` no fim. Depois:

   ```powershell
   npm install
   npm run db:criar      # cria as tabelas e carrega os bairros e turnos do PDF
   npm run admin:criar   # cria o seu login do painel (pede nome, e-mail e senha)
   npm run dev           # API em http://localhost:3000
   ```

3. **Site** (noutro terminal, na raiz do projeto):

   ```powershell
   npm install
   npm run dev           # site em http://localhost:5173
   ```

Os dois precisam ficar rodando: o Vite encaminha tudo que começa com `/api` para a API (`vite.config.ts`).

| Comando (na raiz) | O que faz |
| --- | --- |
| `npm run dev` | Abre o site |
| `npm run api` | Atalho para rodar a API sem entrar na pasta `api` |
| `npm run build` | Confere os tipos e gera a versão final na pasta `dist/` |

| Comando (na pasta `api`) | O que faz |
| --- | --- |
| `npm run dev` | Roda a API e reinicia sozinha quando você salva um arquivo |
| `npm run db:criar` | Cria as tabelas e carrega os dados iniciais. Pode rodar de novo: não apaga nada |
| `npm run admin:criar` | Cria um usuário do painel ou troca a senha de um que já existe |
| `npm start` | Roda a API em produção (sem ler o `.env`) |

## Páginas

| Endereço | O que é |
| --- | --- |
| `/` | Página inicial (explicação, materiais, últimas notícias, dúvidas) |
| `/consulta` | Consulta da coleta: três caixas de busca (CEP, rua e bairro) |
| `/noticias` | Todas as notícias publicadas |
| `/noticias/:id` | Uma notícia |
| `/admin/entrar` | Login da equipe |
| `/admin/bairros` | Painel: locais, turnos e outros nomes |
| `/admin/noticias` | Painel: notícias (criar, editar, agendar, excluir) |

A logo leva para a página inicial em todas as telas (cabeçalho, rodapé, login e painel).

## Como funciona a busca

- **CEP:** a API consulta o [ViaCEP](https://viacep.com.br) (se ele estiver fora do ar, a BrasilAPI) e procura o local da coleta com o nome do bairro do endereço. CEP de outra cidade mostra o aviso de fora da área.
- **Rua:** procura as ruas de Viamão com aquele nome no ViaCEP (mínimo de 3 letras) e mostra os locais encontrados e a lista de endereços.
- **Bairro:** filtra a lista de locais enquanto a pessoa digita. Não depende de serviço de fora.
- **Nomes diferentes:** os Correios às vezes chamam o bairro de outro jeito que a cooperativa (ex.: "Jardim Krahe" e "Krahe"). Quando o nome não bate certinho, o site mostra "possível local" para a pessoa conferir. Para acertar de vez, cadastre o nome dos Correios em **Outros nomes** no painel.
- As respostas do ViaCEP ficam guardadas por 1 dia na memória da API, para não repetir a mesma consulta.

## Banco de dados

- `api/db/schema.sql`: as tabelas (`bairros`, `turnos`, `noticias`, `imagens`, `usuarios`, `sessoes`). Usa `CREATE ... IF NOT EXISTS`, então rodar de novo não apaga nada.
- `api/db/seed.sql`: os 69 locais e 118 turnos do PDF "rotas para divulgação 06.26" e 3 notícias de exemplo (2 delas em rascunho, com trechos entre colchetes). Só carrega se as tabelas estiverem vazias.
- **Revise com a cooperativa** os pontos listados no começo do `seed.sql` (nomes incompletos ou corrigidos na transcrição).
- As imagens das notícias ficam no próprio banco, porque o disco do servidor do Render é apagado a cada deploy. O site reduz a foto para 1200 px antes de enviar.
- Senhas são guardadas com `scrypt` (nunca a senha em si). O login dura 7 dias, num cookie que o JavaScript da página não consegue ler.
- A área de cada bairro no mapa (GeoJSON) fica na coluna `bairros.area`. Enquanto nenhum bairro tiver área, a consulta não mostra o mapa.

## Rotas da API

| Rota | Para quê | Precisa de login |
| --- | --- | --- |
| `GET /api/bairros` | Lista os locais e turnos | não |
| `PUT /api/bairros/:id` | Cria ou edita um local | sim |
| `DELETE /api/bairros/:id` | Exclui um local | sim |
| `GET /api/busca/cep/:cep` | Busca pelo CEP | não |
| `GET /api/busca/rua?q=` | Busca pela rua | não |
| `GET /api/busca/bairro?q=` | Busca pelo nome do local | não |
| `GET /api/noticias` | Notícias no ar | não |
| `GET /api/noticias/:id` | Uma notícia (rascunho e agendada só com login) | não |
| `PUT /api/noticias/:id` | Cria ou edita uma notícia | sim |
| `DELETE /api/noticias/:id` | Exclui uma notícia | sim |
| `GET /api/painel/noticias` | Todas as notícias, inclusive rascunhos | sim |
| `POST /api/imagens` | Envia uma imagem (JPEG, PNG ou WebP, até 3 MB) | sim |
| `GET /api/imagens/:id` | Mostra uma imagem | não |
| `POST /api/auth/entrar` | Login (até 10 tentativas a cada 15 minutos) | não |
| `POST /api/auth/sair` | Sai do painel | não |
| `GET /api/auth/sessao` | Diz quem está logado | não |
| `GET /api/saude` | Confere se a API e o banco estão funcionando | não |

## Publicar no Render

Um único **Web Service** entrega o site e a API no mesmo endereço. Assim o cookie do login funciona sem configuração extra (site e API em domínios diferentes dão dor de cabeça com cookie).

1. Crie o banco Postgres no Render, na mesma região do Web Service.
2. Crie um **Web Service** ligado ao repositório do projeto, com:
   - **Build Command:** `npm install --include=dev && npm run build && npm --prefix api install --omit=dev`
   - **Start Command:** `npm --prefix api start`
   - **Health Check Path:** `/api/saude`
   - **Variáveis de ambiente:** `DATABASE_URL` (a **Internal Database URL** do banco, sem nada no fim) e `NODE_ENV=production`
3. Na primeira vez, crie as tabelas e o login rodando `npm run db:criar` e `npm run admin:criar` no seu computador, com a **External Database URL** no `.env`.

O arquivo `.node-version` faz o Render usar o Node 22. Os preços do Render mudam: confira no site antes de fechar com o cliente.

## Ferramentas

| Ferramenta | Para quê |
| --- | --- |
| Vite | Cria e roda o projeto |
| Vue 3 com `<script setup>` | Componentes |
| Vue Router | Navegação entre as telas |
| Pinia | Dados compartilhados entre as telas (bairros, notícias e login) |
| Tailwind CSS 4 | Estilo e responsivo |
| shadcn-vue + Reka UI | Componentes prontos (botões, select, painel lateral, diálogos) |
| Leaflet | Mapa dos bairros (aparece quando houver áreas cadastradas) |
| TypeScript | Tipos (avisa erros antes de rodar) |
| Express 5 | Rotas da API |
| pg | Conversa com o Postgres |
| Zod | Confere os dados que chegam do painel |
| Helmet e express-rate-limit | Cabeçalhos de segurança e limite de tentativas de login |

O shadcn-vue copia o código dos componentes para dentro do projeto (`src/components/ui`). Dá para mudar o que quiser neles. Para adicionar outro componente: `npx shadcn-vue@latest add nome-do-componente`.

## Onde mexer

| Quero mudar... | Arquivo |
| --- | --- |
| Nome, cidade, contatos, números da home | `src/config.ts` |
| Cidade atendida pela busca de CEP e rua | `CIDADE` e `UF` no `.env` da API |
| Logo e favicon | `src/assets/marca/` e `public/` |
| Cores e fontes | `src/style.css` (bloco `@theme`) |
| Materiais (pode / não pode) | `src/data/materiais.ts` |
| Perguntas frequentes | `src/data/perguntas.ts` |
| Tabelas do banco | `api/db/schema.sql` |
| Bairros e turnos iniciais | `api/db/seed.sql` (depois disso, pelo painel) |
| Como o CEP vira um local da coleta | `api/src/servicos/correspondencia.js` |
| Chamadas do site para a API | `src/services/` |
| Rotas e proteção do painel | `src/router/index.ts` (tela) e `api/src/sessao.js` (de verdade) |

## Estrutura

```
src/                 front-end
├── assets/marca/    logo da COOVIR (símbolo e versão vertical)
├── components/
│   ├── ui/          componentes do shadcn-vue
│   ├── layout/      cabeçalho, rodapé e logo
│   ├── home/        seções da página inicial
│   ├── consulta/    caixas de busca, resultados e mapa
│   ├── noticias/    card e capa das notícias
│   └── admin/       listas e formulários do painel
├── views/           uma tela por rota
├── layouts/         moldura das páginas públicas e do painel
├── stores/          Pinia (bairros, notícias e login)
├── services/        chamadas para a API
├── composables/     lógica reutilizável (localização do GPS)
├── lib/             funções de texto, datas, turnos, notícias e mapa
├── data/            conteúdo fixo (materiais e perguntas)
├── types/           tipos do TypeScript (Bairro, Turno, Noticia...)
├── config.ts        dados da empresa
└── style.css        cores, fontes e tema

api/                 back-end
├── db/              schema.sql (tabelas) e seed.sql (dados iniciais)
├── scripts/         rodar o SQL e criar usuário do painel
└── src/
    ├── rotas/       uma rota por assunto (bairros, busca, notícias...)
    ├── servicos/    consulta de CEP, bairros e comparação de nomes
    ├── lib/         erros, senhas, validação e texto
    ├── app.js       monta a API (e entrega o site em produção)
    ├── sessao.js    login por cookie
    └── servidor.js  liga a API
```

## Problemas comuns

- **"Defina DATABASE_URL"**: falta o arquivo `api/.env`. Copie o `.env.exemplo` e preencha.
- **Erro de SSL ou "self-signed certificate"**: no seu computador use a External Database URL com `?sslmode=verify-full`; no Render, a Internal Database URL sem nada no fim.
- **"Cannot find native binding"** ao rodar o site: apague a pasta `node_modules` e o `package-lock.json` e rode `npm install` de novo.
- **A busca por CEP ou rua diz que o serviço está fora do ar**: o ViaCEP e a BrasilAPI caíram ao mesmo tempo. A busca pelo bairro continua funcionando.

## Antes de publicar

- **Confirme a cidade.** Está como Viamão por causa do "Viamonense" no nome da cooperativa.
- **Revise os bairros e turnos** com a cooperativa (pontos no começo do `seed.sql`).
- **Mapa:** os bairros ainda não têm área. Falta escolher a ferramenta e conseguir os limites reais (GeoJSON) com a prefeitura ou o IBGE. Com as áreas cadastradas, mude `mostrarRuas` para `true` em `src/config.ts`.
- **As notícias são de exemplo** e as que estão em rascunho têm trechos entre colchetes. Edite ou exclua pelo painel.
- **Textos entre colchetes** (`[WHATSAPP]`, `[XX]`...) precisam ser trocados pelos dados do cliente.
- **O banco gratuito do Render é apagado depois de 30 dias.** Para o site no ar, use um plano pago.
- **Nunca suba o `.env`** para o GitHub: ele tem a senha do banco (já está no `.gitignore`).
