# Guia Digital do Hóspede — Seazone

Teste técnico Seazone (AI Builder). A Seazone gerencia milhares de imóveis de temporada e hoje entrega ao hóspede um Guia Digital **estático e igual para todos os imóveis** — um hóspede em Gramado vê o mesmo conteúdo de bairro que um hóspede em Florianópolis.

Este projeto reconstrói o Guia Digital para que **cada imóvel tenha um link único** (`/[code]`, ex.: `/FLN001`) com conteúdo real e específico daquele imóvel:

- **Guia estático**: fotos, capacidade, amenidades, WiFi, instruções de acesso, regras da estadia e contato do anfitrião — vindo do banco de dados.
- **Guia de Experiências por IA**: mensagem de boas-vindas, restaurantes, atrações e serviços essenciais **realmente próximos** ao endereço do imóvel, com dica sazonal. Não é o modelo "chutando" nomes de restaurante — a aplicação geocodifica o endereço e busca lugares reais no OpenStreetMap antes de pedir para a IA descrevê-los (ver decisão D5 abaixo). O guia é gerado uma única vez e persistido.
- **Assistente Virtual (chat)**: responde em streaming, com tool-calling para buscar os dados exatos do imóvel e do guia (nunca parafraseando ou inventando — ver decisão D7).

---

## Stack

- **Next.js 16** (App Router, React Server Components, Route Handlers) + **TypeScript**
- **Tailwind CSS v4**
- **Drizzle ORM** + **Neon** (Postgres serverless)
- **Vercel Blob** (armazenamento das fotos dos imóveis)
- **Vercel AI SDK v7** (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`) + **Claude** (Anthropic)
- **OpenStreetMap** — Nominatim (geocoding) + Overpass (busca de lugares reais por raio)
- **Vitest** (unit/integração) + **Playwright** (e2e)

---

## Como rodar

```bash
npm install
```

### Modo demo, sem infraestrutura

Roda a aplicação inteira — guia estático, geração do Guia de Experiências e chat — sem banco, sem chave de IA e sem rede externa. Repositórios em memória, IA e busca de lugares totalmente mockadas, mesmos imóveis do seed (`FLN001`, `GRM001`, `RIO001`, `UBA001`, `CPD001`):

```bash
DATA_PROVIDER=fake AI_PROVIDER=fake PLACES_PROVIDER=fake npm run dev
```

Acesse `http://localhost:3000/FLN001`.

### Modo completo (com banco, IA e Blob reais)

```bash
cp .env.example .env
# preencha DATABASE_URL, ANTHROPIC_API_KEY e BLOB_READ_WRITE_TOKEN no .env

npm run db:migrate   # aplica o schema no Postgres (Neon)
npm run db:seed      # sobe as fotos para o Vercel Blob e insere os imóveis
npm run dev
```

### Scripts disponíveis (`package.json`)

| Script                | O que faz                                          |
| --------------------- | -------------------------------------------------- |
| `npm run dev`         | Sobe o servidor de desenvolvimento                 |
| `npm run build`       | Build de produção                                  |
| `npm run start`       | Sobe o build de produção                           |
| `npm run lint`        | ESLint                                             |
| `npm run test`        | Testes unitários/integração (Vitest)               |
| `npm run test:watch`  | Vitest em modo watch                               |
| `npm run test:e2e`    | Testes e2e (Playwright)                            |
| `npm run db:generate` | Gera uma nova migration a partir do schema Drizzle |
| `npm run db:migrate`  | Aplica as migrations no Postgres                   |
| `npm run db:seed`     | Popula o banco (e sobe fotos para o Blob)          |

---

## Testes

```bash
npm run test
npm run test:e2e   # Playwright, guia + 404 + geração do guia + chat, modo fake
```

Em ambos, IA e rede são mockadas na fronteira (`AIProvider`, `PlacesProvider`) — nenhum teste faz chamada real a Claude, Nominatim/Overpass ou depende de um banco vivo (os testes de repositório usam Postgres em memória via `pglite`). Isso deixa a suíte determinística, rápida e sem custo.

**Limitação assumida conscientemente**: o e2e do chat roda com `AI_PROVIDER=fake`, cujo modelo emite um texto canônico fixo ("Resposta de teste."). O e2e prova o **fluxo** (enviar pergunta → streaming aparece → tool é chamada), não a **correção** das 4 respostas esperadas pelo desafio. Essa correção — a senha do WiFi certa, a regra de pet certa, etc. — é validada manualmente contra o modelo real após o deploy, porque depende do Claude de fato interpretando a pergunta e chamando a tool certa.

---

## Arquitetura

### Camada de dados

`src/db/schema.ts` (Drizzle) define `properties`, `property_access`, `property_rules`, `property_images` e `experience_guides`. `src/repositories/` isola todo o SQL do resto da aplicação (`propertyRepository`, `guideRepository`). A geração do Guia de Experiências usa um **claim atômico** (`INSERT ... ON CONFLICT DO UPDATE` guardado por `status`/`claimed_at`) para garantir que dois acessos concorrentes ao mesmo imóvel novo não disparem duas gerações em paralelo — quem perde a corrida espera o vencedor terminar consultando só o banco.

Um segundo par de repositórios (`fakePropertyRepository`, `fakeGuideRepository`), selecionado por `DATA_PROVIDER=fake`, implementa a mesma interface em memória — é o que viabiliza o modo demo e o e2e sem infraestrutura.

### Subsistema de IA

- **Boundary `AIProvider`** (`src/ai/provider.ts`): expõe `guideModel`/`chatModel` (`LanguageModel` do AI SDK). Em produção resolve para Claude via `@ai-sdk/anthropic`; com `AI_PROVIDER=fake` resolve para um `MockLanguageModelV4` que emite respostas fixas passando pela mesma máquina real de `streamObject`/`streamText` — os testes exercitam o pipeline de verdade, só trocam o modelo.
- **Guia de Experiências — grounding real**: antes de acionar a IA, `src/places/provider.ts` geocodifica o endereço do imóvel (Nominatim) e busca restaurantes/atrações/farmácias/mercados/hospitais num raio ao redor (Overpass). O prompt (`src/ai/prompts/guidePrompt.ts`) manda o modelo **descrever exatamente esses lugares** — nunca substituir ou inventar; só cai para "sugira lugares reais e notórios" quando a busca não retorna resultado suficiente numa categoria (fallback, nunca quebra a geração). Isso também está por trás do boundary `PlacesProvider` (real via Overpass, fake determinístico em teste).
- **Chat — tool-calling**: o system prompt (`src/ai/prompts/chatPrompt.ts`) carrega só persona e regras de comportamento — nenhum dado do imóvel é embutido nele. O modelo chama `getPropertyInfo` (WiFi, regras, acesso, anfitrião) ou `getNearbyPlaces` (restaurantes/atrações/essenciais do guia) para obter os dados estruturados exatos (`src/ai/chatTools.ts`). `getNearbyPlaces` retorna um sinal explícito de "guia ainda sendo preparado" quando o status não é `ready`, evitando que o assistente minta nessa janela. Streaming via `streamText` + `stepCountIs(3)` (até 2 tool calls + resposta final).
- **Tratamento de falhas**: geração com erro grava `status='failed'` + mensagem amigável na UI (dados estáticos continuam visíveis) e botão para gerar novamente; erro de stream no chat vira uma bolha de erro com opção de reenvio.

### UI (Atomic Design)

Componentes organizados em `atoms/molecules/organisms/templates` (`src/components/`). Direção visual "Editorial Luxe" (serif Fraunces para títulos + Inter no corpo), com **acento de cor adaptativo** por `property.category` (`src/theme/accent.ts` — praia → teal, serra → verde, capital → clay), amarrando a identidade visual ao tema de personalização por IA. Ícones via `lucide-react` encapsulados num átomo `Icon` com mapa central de domínio (sem emojis). Mobile-first, imagens via `next/image`.

---

## Decisões técnicas (X e não Y)

Esta é a seção mais importante do README — o log de decisões arquiteturais do projeto, com as alternativas descartadas e o porquê.

| #   | Decisão                        | Escolhido                                                                                                                                                                 | Alternativa descartada                                       | Por quê                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | ORM / dados                    | **Drizzle ORM** + driver Neon serverless                                                                                                                                  | Prisma; SQL puro                                             | Type-safe, leve, SQL-first, migrations e seed limpos e ótimo em serverless. Prisma é mais pesado (engine binário, atrito serverless); SQL puro geraria boilerplate e mapeamento manual.                                                                                                                                                                                                                                                                                                                                                            |
| D2  | Banco                          | **Postgres (Neon)** via Vercel                                                                                                                                            | SQLite; mock/arquivo                                         | Relacional real, serverless, integra direto com a Vercel; alinhado ao exemplo de dados do desafio.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| D3  | Camada de IA                   | **Vercel AI SDK v7** (`@ai-sdk/anthropic`)                                                                                                                                | `assistant-ui`; SDK da Anthropic puro                        | Camada única para `streamObject` (guia) e `streamText`/`useChat` (chat), streaming nativo no Next, com UI 100% custom. `assistant-ui` deixaria o visual menos autoral; o SDK puro da Anthropic reinventaria streaming/estado do chat na mão.                                                                                                                                                                                                                                                                                                       |
| D4  | Modelo LLM                     | **Claude**, com modelo separado por caso de uso (`AI_MODEL_GUIDE`/`AI_MODEL_CHAT`, configuráveis por env)                                                                 | Gemini/GPT; um único modelo para tudo                        | Qualidade + structured output nativo + streaming. O guia roda uma única vez e é persistido (prioriza qualidade); o chat é recorrente por conversa (prioriza latência/custo).                                                                                                                                                                                                                                                                                                                                                                       |
| D5  | Fidelidade dos lugares do guia | **Grounding real via OpenStreetMap** (Nominatim + Overpass) atrás de um boundary `PlacesProvider`; o LLM descreve lugares reais encontrados, não inventa                  | Só prompt ("use lugares reais"); Google Places API           | Coerência com o endereço real é o critério de maior peso do desafio — prompt sozinho alucina nomes. OSM/Overpass é gratuito e sem API key/billing (vs. Google Places = chave e custo). Geocodifica o endereço e busca por raio os lugares reais; o LLM só escreve descrição e distância aproximada **desses** lugares. O boundary (`PlacesProvider` real + fake determinístico) mantém os testes sem rede, e há fallback por categoria para quando a Overpass não retorna dado suficiente — a geração nunca quebra por causa de uma fonte externa. |
| D6  | Geração do guia                | **Persistida, gerada uma única vez com claim atômico**; primeira visita usa `streamObject` direto no skeleton                                                             | Regenerar a cada acesso; pré-seed no banco                   | Atende ao requisito de "não regenerar" e ao de "feedback visual". O claim atômico (`INSERT ... ON CONFLICT DO UPDATE` + coluna `status`/`claimed_at`) evita geração duplicada em acessos concorrentes ao mesmo imóvel novo. `streamObject` dá o efeito "ao vivo" na primeira visita; visitas seguintes vêm direto do banco.                                                                                                                                                                                                                        |
| D7  | Grounding do chat              | **Tool-calling**: o modelo chama `getPropertyInfo` e `getNearbyPlaces` para obter os dados estruturados exatos; o system prompt carrega só persona + regras, não os dados | Dados embutidos no system prompt (paráfrase); RAG/embeddings | Garante que fatos como a senha do WiFi venham do **dado estruturado exato** retornado pela tool, não de uma paráfrase do modelo. As tools leem direto dos repositórios; `getNearbyPlaces` sinaliza claramente quando o guia ainda está sendo preparado, resolvendo a janela em que o hóspede pergunta por restaurantes antes da geração terminar. RAG seria overengineering para o volume de dados de um único imóvel.                                                                                                                             |
| D8  | Mídia                          | **Vercel Blob** (upload no seed)                                                                                                                                          | URLs externas (Unsplash) direto em produção                  | Demonstra o pipeline full-stack de mídia (upload → storage → otimização via `next/image`) e dá controle sobre os assets.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| D9  | Padrão de componentes          | **Atomic Design**                                                                                                                                                         | Estrutura ad-hoc                                             | Critério explícito do desafio; componentes isolados, testáveis e reutilizáveis.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| D10 | Direção visual                 | **Editorial Luxe** (Fraunces + Inter) com **acento adaptativo por destino**                                                                                               | Aurora Dark; Minimal Swiss; cor fixa                         | Elegante e acolhedor (hotel boutique) com craft técnico. O acento adaptativo (praia → teal, serra → verde, capital → clay) amarra a cor ao tema de personalização por IA.                                                                                                                                                                                                                                                                                                                                                                          |
| D11 | Ícones                         | **Lucide** (`lucide-react`) via átomo `Icon` + mapa central                                                                                                               | Emojis genéricos; Phosphor                                   | Set consistente de line-icons, elegante, tree-shakeable, padrão do ecossistema. Emojis renderizam diferente por sistema operacional e não têm cara de produto.                                                                                                                                                                                                                                                                                                                                                                                     |
| D12 | Testes                         | **Vitest + Playwright**, IA e rede mockadas no boundary (`AIProvider`/`PlacesProvider` injetáveis)                                                                        | Testes com IA/rede reais; e2e-first                          | Determinístico, rápido e sem custo/flakiness em CI. Força injeção de dependência da IA e dos lugares (arquitetura limpa).                                                                                                                                                                                                                                                                                                                                                                                                                          |

---

## Estrutura de pastas

```
app/
  [code]/page.tsx · loading.tsx · not-found.tsx      # rota pública do guia
  api/properties/[code]/guide/route.ts               # POST: gera/persiste/reemite o guia (streamObject)
  api/properties/[code]/chat/route.ts                 # POST: streamText com tool-calling
  layout.tsx · globals.css
src/
  db/            # schema Drizzle, client, migrations, seed
  domain/        # tipos + schemas Zod (Property, ExperienceGuide)
  ai/            # AIProvider, prompts, geração do guia, chat (tools + streaming)
  places/        # PlacesProvider (Nominatim + Overpass), tipos, fake
  repositories/  # propertyRepository / guideRepository (reais + fake em memória)
  components/    # atoms | molecules | organisms | templates, icons.ts
  theme/         # accent.ts (acento por categoria de imóvel)
  test/          # fixtures e helpers de teste
tests/e2e/       # Playwright (guia, 404, geração, chat)
```

---

## Deploy

O projeto foi desenhado para o par Vercel + Neon + Blob:

1. **Importar o repositório** no dashboard da Vercel (ou `vercel` CLI), framework Next.js detectado automaticamente.
2. **Banco**: adicionar a integração de Postgres (Neon) ao projeto na Vercel — isso provisiona `DATABASE_URL` automaticamente.
3. **Blob**: adicionar a integração Vercel Blob ao projeto — isso provisiona `BLOB_READ_WRITE_TOKEN`.
4. **Variáveis de ambiente** (Project Settings → Environment Variables), além das provisionadas acima:
   - `ANTHROPIC_API_KEY`
   - `AI_MODEL_GUIDE` (default `claude-opus-4-8`)
   - `AI_MODEL_CHAT` (default `claude-sonnet-5`)
   - `AI_PROVIDER=anthropic`
   - `PLACES_PROVIDER=overpass`
   - **Não** definir `DATA_PROVIDER` em produção — o app deve usar o banco real.
5. **Migrations**: `DATABASE_URL=<neon> npm run db:migrate`.
6. **Seed**: `DATABASE_URL=<neon> BLOB_READ_WRITE_TOKEN=<token> npm run db:seed` (sobe as fotos para o Blob e insere os imóveis de exemplo).
7. **Deploy** e smoke test manual: `/FLN001` e `/GRM001` (guia, geração real do Guia de Experiências, chat respondendo as 4 perguntas do desafio) e `/XXX999` (404 amigável).
8. Atualizar este README com a URL pública.
