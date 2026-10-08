# Site da COOVIR: coleta seletiva

Front-end do site da COOVIR (Cooperativa de Trabalho Viamonense de Catadores e Recicladores): home explicativa, consulta de dias e turnos por bairro (com mapa), notícias e painel do administrador.

## Como rodar

Precisa do [Node.js](https://nodejs.org) 20.19+ ou 22.12+.

```bash
npm install      # instala as dependências (só na primeira vez)
npm run dev      # abre o site em http://localhost:5173
npm run build    # confere os tipos e gera a versão final na pasta dist/
npm run preview  # testa a versão final no seu computador
```

**Login de teste do painel** (`/admin`): `admin@exemplo.com` / `coleta123`

## Páginas

| Endereço | O que é |
| --- | --- |
| `/` | Página inicial (explicação, materiais, últimas notícias, dúvidas) |
| `/consulta` | Consulta de dias e turnos por bairro, com mapa |
| `/noticias` | Todas as notícias publicadas |
| `/noticias/:id` | Uma notícia |
| `/admin/entrar` | Login da equipe |
| `/admin/bairros` | Painel: bairros e turnos |
| `/admin/noticias` | Painel: notícias (criar, editar, agendar, excluir) |

### Como funcionam as notícias

- **Publicada**: aparece no site a partir da data de publicação.
- **Agendada**: publicada com data futura. Só aparece no site quando chegar o dia.
- **Rascunho**: fica só no painel.
- Logado no painel, você consegue abrir rascunhos e agendadas no site para conferir (aparece uma faixa de "Pré-visualização").
- O texto é simples: uma linha em branco separa os parágrafos. Não é preciso (nem possível) colar HTML, o que evita problemas de segurança.
- Sem imagem de capa, a notícia usa o símbolo da COOVIR sobre uma das cores da logo.

## Ferramentas

| Ferramenta | Para quê |
| --- | --- |
| Vite | Cria e roda o projeto |
| Vue 3 com `<script setup>` | Componentes |
| Vue Router | Navegação entre as telas |
| Pinia | Dados compartilhados entre as telas (bairros, notícias e login) |
| Tailwind CSS 4 | Estilo e responsivo |
| shadcn-vue + Reka UI | Componentes prontos (botões, select, painel lateral, diálogos) |
| Leaflet | Mapa dos bairros |
| TypeScript | Tipos (avisa erros antes de rodar) |

O shadcn-vue copia o código dos componentes para dentro do projeto (`src/components/ui`). Dá para mudar o que quiser neles. Para adicionar outro componente: `npx shadcn-vue@latest add nome-do-componente`.

## Onde mexer

| Quero mudar... | Arquivo |
| --- | --- |
| Nome, cidade, contatos, números da home | `src/config.ts` |
| Logo e favicon | `src/assets/marca/` e `public/` |
| Cores e fontes | `src/style.css` (bloco `@theme`) |
| Materiais (pode / não pode) | `src/data/materiais.ts` |
| Perguntas frequentes | `src/data/perguntas.ts` |
| Bairros de exemplo | `src/data/bairrosExemplo.ts` |
| Notícias de exemplo | `src/data/noticiasExemplo.ts` |
| Ligar com o backend | `src/services/` (`bairrosApi.ts`, `noticiasApi.ts`, `imagensApi.ts`, `authApi.ts`) |
| Rotas e proteção do painel | `src/router/index.ts` |

## Estrutura

```
src/
├── assets/marca/    logo da COOVIR (símbolo e versão vertical)
├── components/
│   ├── ui/          componentes do shadcn-vue
│   ├── layout/      cabeçalho, rodapé e logo
│   ├── home/        seções da página inicial
│   ├── consulta/    busca, resultado e mapa
│   ├── noticias/    card e capa das notícias
│   └── admin/       listas e formulários do painel
├── views/           uma tela por rota
├── layouts/         moldura das páginas públicas e do painel
├── stores/          Pinia (bairros, notícias e login)
├── services/        conversa com o backend (hoje simulado)
├── composables/     lógica reutilizável (localização do GPS)
├── lib/             funções de texto, datas, turnos, notícias e mapa
├── data/            conteúdo fixo e dados de exemplo
├── types/           tipos do TypeScript (Bairro, Turno, Noticia...)
├── config.ts        dados da empresa
└── style.css        cores, fontes e tema
```

## Antes de publicar

- **Confirme a cidade.** Está como Viamão por causa do "Viamonense" no nome da cooperativa (`src/config.ts`).
- **Bairros, horários e áreas do mapa são de exemplo.** As áreas ficam no mar de propósito. Troque pelos limites reais em GeoJSON (prefeitura ou IBGE) e mude `mostrarRuas` para `true` em `src/config.ts`.
- **As notícias são de exemplo** e algumas têm trechos entre colchetes. Edite ou exclua pelo painel.
- **Textos entre colchetes** (`[WHATSAPP]`, `[XX]`...) precisam ser trocados pelos dados do cliente.
- **O login é só uma simulação.** Quem confere e-mail e senha tem que ser o backend, que devolve um token (de preferência em cookie httpOnly) e valida esse token em toda alteração. Esconder a tela no front não protege nada sozinho.
- **Os dados ficam no navegador (localStorage)** enquanto não existir API. Cada computador vê os seus. Os comentários nos arquivos de `src/services/` mostram como trocar por `fetch`.
- **Imagens das notícias:** na demonstração, a foto é reduzida e salva no próprio navegador, que tem pouco espaço. No site real, envie o arquivo para o backend (veja `src/services/imagensApi.ts`).
- **Hospedagem:** como o site usa rotas sem `#`, o servidor precisa devolver o `index.html` para qualquer endereço. Isso já está configurado para a Vercel (`vercel.json`) e para a Netlify (`public/_redirects`).
