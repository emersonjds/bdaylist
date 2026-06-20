# CLAUDE.md — BdayList

Regras de ouro para todo desenvolvimento assistido por IA neste projeto. Leia e siga integralmente antes de qualquer tarefa.

> 🎨 **Fonte de verdade do design:** a pasta [`design/`](design/) (telas PNG do Stitch + `00-design-system.md`). O produto é desenvolvido **com base nessas imagens**. Consulte antes de implementar qualquer tela.

---

## 1. Identidade do Produto

- **Nome**: BdayList
- **Domínio**: plataforma de **lista de presentes de aniversário** (estilo casar.com) — o aniversariante cria sua lista, compartilha o link e os convidados escolhem/reservam o presente que vão dar.
- **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, pnpm
- **Tipo**: SPA com static export (`output: "export"`) — sem servidor próprio; dados direto do Supabase (MSW só nos testes)
- **Deploy**: Netlify (static export — publish `out/`)
- **Idioma da UI**: português brasileiro em 100% dos textos visíveis

### Escopo de dinheiro (importante)

- **Por enquanto NÃO há dinheiro passando pelo app.** O convidado apenas **reserva/marca** o presente que vai dar; o presente em si é combinado/entregue fora da plataforma.
- O design do Stitch mostra metas, "% arrecadado" e "contribuir" — isso é **direção futura** (provável PIX externo ou gateway), **fora do escopo atual**. Não implemente processamento de pagamento sem decisão explícita.

## 2. Identidade Visual — "Vibrant Celebration"

> Tokens completos em [`design/00-design-system.md`](design/00-design-system.md).

- **Primária** (coral vibrante): `brand-500` = `#FF5A70`; tom profundo p/ CTAs e texto de marca = `#b5213e`
- **Secundária** (turquesa): `#26C6DA` (escuro `#006874`)
- **Terciária / acento** (amarelo festivo): `#FFD54F` (escuro `#cda721`)
- **Confetti** (micro-detalhes): rosa `#FF85A2`, azul `#76E4F7`, amarelo `#FFE082`
- **Surface**: branco em cards sobre fundo rosa-claro `#FFF9FB`; texto `#161d1f`
- **Tipografia**: **Montserrat** (exclusiva) — títulos ExtraBold/Bold com letter-spacing levemente negativo; corpo Regular
- **Formas**: botões pílula (`rounded-full`), cards `rounded-lg` (16px), inputs `rounded-md` (8px). Sombras suaves com leve tom coral.
- Light mode como padrão. Clima: festa de aniversário, alegre, festivo mas organizado.

## 3. Regras de Git — OBRIGATÓRIO

- **Micro-commits atômicos** — uma mudança lógica por commit
- Mensagens em **inglês**, imperativo curto: `add X`, `fix Y`, `translate Z`
- **Proibido mencionar** Claude, Anthropic, IA, agent ou qualquer ferramenta de IA em mensagens de commit, PRs ou comentários
- **Proibido** rodapé `Co-Authored-By: Claude` ou similar
- **O push final é sempre do desenvolvedor humano** — nunca `git push` sem confirmação explícita
- Versionados: `.claude/agents/`, `.claude/settings.json`, `.mcp.json`, `.bluespec/`, `design/`. Nunca commitar `.claude/settings.local.json`, `.serena/`, sessões/credenciais de IA

## 4. Qualidade de Código

> **Estas regras são OBRIGATÓRIAS para qualquer pessoa ou agent que escreva código neste projeto** — valem sempre, em toda tarefa e em todo subagent acionado.

- **Comentários: só o extremamente necessário.** Comente apenas o "porquê" não-óbvio de uma **regra** (de negócio, segurança, fuso, armadilha). Proibido comentário que narra/reescreve o que o código já diz.
- **Legível em ≤10s por qualquer nível** (jr, pleno, sênior). Se exige mais que isso, simplifique — nomes claros, funções pequenas de propósito único, sem esperteza desnecessária.
- **Melhores padrões E simples.** O melhor padrão aqui é o mais simples que resolve bem. Sem abstração prematura, sem código morto.
- **Performance e escalabilidade sempre no radar.** Evite trabalho desnecessário (re-render, recomputação, query/loop redundante); escolha estruturas que aguentam crescer — sem micro-otimização que prejudique a clareza.
- Prefira editar arquivos existentes a criar novos.
- TypeScript: tipos explícitos em interfaces públicas; **sem `any`** (use `unknown` + narrowing); props sempre com interface nomeada.
- Nomes semânticos — proibido identificadores de uma letra.
- Tailwind: mobile-first (`sm:`/`md:`/`lg:`), usar tokens do design system (`brand-*`, etc.).

## 5. Arquitetura — Feature-Sliced Design

```
src/
├── app/          ← Next.js App Router. Rotas e layouts. Sem regra de negócio.
├── widgets/      ← UI composta (header, lista-de-presentes, painel). Junta features+entities.
├── features/     ← Casos de uso (criar-lista, reservar-presente, confirmar-presenca).
├── entities/     ← Modelos de domínio (aniversariante, evento, presente, lista, convidado, reserva).
└── shared/       ← Infra reutilizável (ui, lib, hooks, providers).
```

**Regra de import**: só importar de **layers abaixo** (`app → widgets → features → entities → shared`). Nunca o contrário, nunca lateral entre slices da mesma layer.

## 6. Dados / API

- Backend é **Supabase** (Postgres + RLS + RPCs + Edge Functions). O app é SPA static export e fala **direto** com o Supabase via `@supabase/ssr`. **Não há MSW** fora dos testes — dados reais vêm do banco.
- Usa a **publishable key** (pública por design; a proteção é a RLS no Postgres). A `service_role` NUNCA vai para o frontend.
- Config em `.env.local`: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Schema/migrations em `supabase/migrations/`.

## 7. Segurança

- Nunca commitar secrets/tokens/chaves de API
- **Link de compartilhamento** da lista usa token de alta entropia (não adivinhável)
- **Reserva de presente** é fonte de verdade do servidor: atômica (sem reserva dupla) e idempotente — nunca confiar no cliente
- Privacidade/LGPD: e-mail e identidade dos convidados restritos a quem precisa; opção de "surpresa" (aniversariante não ver quem reservou)
- Validar todo input no servidor (nomes, mensagens, URLs de loja) — anti-XSS e anti-SSRF

## 8. Review (antes de concluir)

- [ ] `pnpm type-check` sem erros
- [ ] Textos da UI em PT-BR
- [ ] Responsivo (375px, 768px, 1280px) — **mobile-first** (o design é mobile-first)
- [ ] Fiel ao design em `design/`
- [ ] Sem `console.log` / código de debug
- [ ] Imports não usados removidos

### Testes obrigatórios por implementação (SDD)

Toda feature deve ter as três camadas — e o E2E vale mais que os mocks:

1. **Unitário** — lógica pura (libs, derivações, regras).
2. **Integração com MSW** — fetchers/queries contra o Supabase mockado.
3. **E2E de tela (Playwright)** — fluxo real no browser, **com prints de evidência em PNG** em `e2e/<feature>/evidencias/*.png`.

## 9. Agentes disponíveis

Especialistas de domínio: `arq` (arquitetura, APIs e integrações), `front` (frontend, performance e segurança client-side), `back` (backend, integridade de reserva, enriquecimento de links e Supabase), `pixel` (UX/UI design), `redteam` (segurança ofensiva e threat modeling).
Execução e qualidade: `bug` (QA/quality gate de código), `qa` (E2E em tela com Playwright), `scribe` (i18n PT-BR, docs).

Regra: **um agent por função, sem duplicação**.

## 10. Domínio: BdayList

- **Aniversariante** (host): cria o evento e a lista, compartilha o link, gerencia presentes e vê confirmações.
- **Evento/Aniversário**: a celebração — data, tema, mensagem, capa, contagem regressiva ("Faltam X dias").
- **Presente/Item**: o desejo na lista — nome, descrição, imagem, preço de referência, link da loja; flags "Mais Desejado" e "Presente em Grupo".
- **Lista de presentes**: a coleção de presentes do evento, acessível por link compartilhável.
- **Convidado** (guest): acessa pelo link, confirma presença e reserva presentes.
- **RSVP**: confirmação de presença do convidado.
- **Reserva**: o convidado marca que vai dar aquele presente (status: disponível → reservado). Evita presente duplicado. Server-authoritative, atômica e idempotente.
- **Recado/Mensagem**: mensagem carinhosa do convidado ao aniversariante (mural).

### Telas-núcleo (ver `design/`)
- **Landing page** — marketing: hero, "como funciona", inspiração, depoimentos, FAQ.
- **Painel do aniversariante** — contagem regressiva, presentes (adicionar/editar), convidados confirmados, atividade recente. Bottom nav: Início, Presentes, Convidados, Perfil.
- **Lista (visão convidado)** — header do aniversariante, confirmar presença (RSVP), filtro por preço, busca, grid de presentes com "Presentear".
- **Finalizar presente** — resumo, mensagem carinhosa, confirmação ("Presente Enviado!").
