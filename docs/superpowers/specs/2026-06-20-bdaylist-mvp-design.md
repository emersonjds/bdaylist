# BdayList — Spec do MVP (fatia única, execução incremental)

> Data: 2026-06-20
> Fonte de verdade visual: `design/` (PNGs + `00-design-system.md`) e as HTMLs do Stitch em `~/Desktop/stitch_birthday_gift_registry/`.
> Produto: plataforma de **lista de presentes de aniversário** (estilo casar.com). Sem dinheiro no app — o convidado **reserva/marca** o presente; entrega combinada fora da plataforma.

## 1. Objetivo

Construir o MVP navegável do BdayList com as 4 telas do design (Landing, Painel do aniversariante, Lista visão convidado, Finalizar presente), **todas as funcionalidades mockadas com MSW no browser** enquanto o Supabase não está configurado. O login Google fica **pré-estruturado** (entrypoint real `signInWithGoogle`) mas servido pelo mock, para que ligar o Supabase depois seja só trocar a implementação do fetcher/auth e o `.env`.

### Não-objetivos (YAGNI)
- Nenhum processamento de pagamento / PIX / contribuição em dinheiro (é direção futura do Stitch, fora de escopo).
- Sem backend Supabase real nesta fatia (entra depois, sem mexer na UI).
- Sem e-mail/notificações reais (cron, nodemailer) nesta fatia.
- Sem enriquecimento de link de loja por Open Graph nesta fatia (campo manual de imagem/URL).

## 2. Stack e convenções

Espelha o projeto `bolao-copa`:

- **Next.js 16** (App Router) com `output: "export"` (SPA estática, publish `out/`).
- **React 19**, **TypeScript** (sem `any`; `unknown` + narrowing), **Tailwind CSS 4**, **pnpm**.
- **@tanstack/react-query** para estado de servidor; fetchers tipados batem em uma API REST fake interceptada pelo **MSW**.
- **react-hook-form + zod** para formulários e validação.
- **lucide-react** para ícones (mapeando os Material Symbols das HTMLs).
- **sonner** para toasts.
- **class-variance-authority + clsx + tailwind-merge** para variantes de componentes.
- Testes: **vitest** + `@testing-library/react` + **@playwright/test**; mocks com **msw**.
- Lint/format: eslint (flat config) + prettier + prettier-plugin-tailwindcss; `pnpm type-check` limpo é gate.

### Arquitetura FSD
```
src/
├── app/        Rotas e layouts (sem regra de negócio)
├── widgets/    UI composta (app-shell, gift-grid, host-header…)
├── features/   Casos de uso (auth, reservar-presente, rsvp, gerenciar-presentes…)
├── entities/   Domínio (evento, presente, lista, convidado, reserva, rsvp, recado)
└── shared/     Infra (ui, lib, hooks, providers)
```
Regra de import: só de layers **abaixo**; nunca lateral entre slices da mesma layer.

## 3. Design system → Tailwind 4

Tokens de `design/00-design-system.md` viram tema via `@theme` no CSS global. Essenciais:

- **primary** `#b5213e` (CTAs/marca, texto profundo) · **primary-container / brand-500** `#ff5a70` (coral vibrante).
- **secondary** turquesa `#006874` / container `#5ce9fe` (foco de input, progresso).
- **tertiary** amarelo `#cda721` / fixed `#ffe087` (badges "Mais Desejado/Novo", acentos).
- **confetti**: pink `#FF85A2`, blue `#76E4F7`, yellow `#FFE082` (micro-detalhes).
- **surfaces**: cards brancos `#ffffff` sobre fundo `surface-soft #FFF9FB`; texto `on-surface #161d1f`.
- **Tipografia**: Montserrat exclusiva (400/600/700/800), títulos com letter-spacing levemente negativo.
- **Formas**: botões pílula (`rounded-full`), cards `rounded-lg` (16px), inputs `rounded-md` (8px).
- **Sombras**: difusas com tom coral, ex.: `0 10px 30px rgba(255,90,112,0.08)`; hover levanta o card (`-translate-y-1`).
- Light mode padrão. Mobile-first (`sm:`/`md:`/`lg:`).

## 4. Camada de dados e MSW (o ponto central)

O app fala com uma **API REST fake** por fetchers tipados (em `entities/*/api` e `features/*/api`). O **MSW roda no browser** e nos testes:

- `src/mocks/db.ts` — "banco" em memória com seed determinístico (um evento exemplo, presentes, convidados, reservas).
- `src/mocks/handlers.ts` — handlers REST que aplicam as regras de domínio (ver §6). Compartilhados entre browser e testes.
- `src/mocks/browser.ts` — `setupWorker(...handlers)`; `public/mockServiceWorker.js` gerado por `pnpm msw init`.
- `src/mocks/server.ts` — `setupServer(...handlers)` para vitest (integração).
- Habilitação: provider em `app/` chama `worker.start()` só quando `NEXT_PUBLIC_API_MOCKING === "enabled"`. Em produção/Supabase real, fica desligado.

**Seam para o Supabase**: os fetchers são a única fronteira de dados. Trocar MSW por Supabase = reescrever a implementação dos fetchers (mesma assinatura/tipos), sem tocar em componentes/hooks.

## 5. Auth (mock agora, pronto pra Google)

`features/auth`:
- `AuthProvider` + `useAuth()` expõem `{ user, loading, signInWithGoogle, signOut }`.
- `signInWithGoogle()` é o **entrypoint real do futuro**. Hoje dispara um fluxo que o MSW resolve com uma **sessão Google simulada** (usuário aniversariante de exemplo). A sessão mock persiste em `localStorage` para sobreviver a reload.
- Rotas protegidas (`/painel`) redirecionam para a Landing/CTA quando sem sessão.
- `signOut()` limpa a sessão mock.
- Estrutura espelha o bolão (`signInWithGoogle`, callback) para que o swap futuro para Supabase OAuth (PKCE) seja trivial.

## 6. Domínio e regras (entities)

Cada entity tem `model.ts` (tipos + schema zod) e `api/` (fetchers).

- **evento**: `{ id, hostId, titulo, dataAniversario, tema, mensagem, capaUrl, listToken }`. Deriva contagem regressiva ("Faltam X dias").
- **presente**: `{ id, eventoId, nome, descricao, imagemUrl, precoReferencia, linkLoja, maisDesejado, emGrupo, status: 'disponivel'|'reservado' }`.
- **lista**: coleção de presentes de um evento, acessível por `listToken` de alta entropia (não adivinhável).
- **convidado**: `{ id, eventoId, nome, email }` (privacidade: e-mail restrito).
- **reserva**: `{ id, presenteId, convidadoNome, recado, criadaEm }`. **Regra central**: reservar é **server-authoritative, atômico e idempotente** — o handler trava o presente (`disponivel→reservado`); tentativa de reservar item já reservado retorna conflito (409), nunca reserva dupla. Reenvio da mesma reserva é idempotente.
- **rsvp**: confirmação de presença do convidado `{ eventoId, nome, status: 'confirmado'|'recusado' }`.
- **recado**: mensagem carinhosa ao mural `{ eventoId, autor, texto, criadoEm }`.

## 7. Rotas e telas

### `/` — Landing (`landing_page_bdaylist/code.html`)
Marketing: hero com CTA "Criar minha lista", "como funciona" (passos), inspiração/galeria, depoimentos, FAQ (accordion), footer. CTA de login → `signInWithGoogle`.

### `/painel` — Painel do aniversariante (`painel_do_aniversariante/code.html`) — protegida
Contagem regressiva do evento; seção de presentes com adicionar/editar/remover (modal `gift-form`); convidados confirmados; atividade recente. **Bottom-nav** mobile: Início, Presentes, Convidados, Perfil. Sem sessão → CTA de login.

### `/l/[token]` — Lista visão convidado (`lista_de_presentes_vis_o_convidado/code.html`) — pública
Header do aniversariante (capa, nome, contagem). **RSVP** (confirmar presença). Busca por nome + **filtro por faixa de preço**. **Grid de presentes** (`gift-card` com imagem, nome, preço, badges, botão "Presentear"; itens reservados aparecem desabilitados). Mural de recados.

### `/l/[token]/presentear/[giftId]` — Finalizar presente (`finalizar_presente/code.html`)
Resumo do presente escolhido; campo de **recado carinhoso**; botão confirmar → chama reserva (idempotente). Sucesso: tela "Presente Enviado!" com **confetti-burst**. Conflito (já reservado) → mensagem amigável e volta à lista.

## 8. Widgets e componentes

Extraídos das HTMLs (fiel ao design):
- `widgets/app-shell` — header + bottom-nav (mobile) reutilizável no painel.
- `widgets/host-header` — capa + nome + contagem regressiva (lista do convidado).
- `widgets/gift-grid` — grade responsiva (1–2 col mobile, 3–4 desktop, gutter 24px).
- `features/.../gift-card` — imagem topo (12px), título `headline-md`, preço bold primário, badges, botão "Presentear"/"Contribuir" sempre visível.
- `features/rsvp/rsvp-form`, `features/gerenciar-presentes/gift-form` (modal), `features/lista/price-filter`, `entities/evento/countdown`.
- `shared/ui`: `button` (pílula coral / ghost com borda 2px; scale 1.05 hover), `input` (borda 2px, turquesa no focus, label sempre visível), `card`, `badge` (amarelo + texto escuro), `dialog`, `confetti-burst`.

## 9. Testes (SDD obrigatório por feature)

Três camadas, E2E vale mais que mocks:
1. **Unit** (vitest): regras puras — contagem regressiva, formatação de preço, derivação de status, validação zod.
2. **Integração MSW** (vitest + `server.ts`): fetchers contra handlers — inclusive **reserva idempotente / conflito 409**.
3. **E2E Playwright**: fluxos reais no browser com **prints PNG** em `e2e/<feature>/evidencias/*.png`. Âncoras: reservar presente (sucesso + duplo-reservar bloqueado), RSVP, criar/editar presente no painel, login mock.

## 10. Critérios de aceite (Definition of Done)

- [ ] `pnpm type-check` sem erros; sem `any`.
- [ ] As 4 telas + landing navegáveis, fiéis ao `design/`, responsivas (375/768/1280), mobile-first.
- [ ] Todos os textos da UI em **PT-BR**.
- [ ] MSW intercepta no browser; app funciona sem Supabase.
- [ ] Reserva mockada é idempotente e bloqueia duplo-reserva (409).
- [ ] Login "Entrar com Google" entrega sessão mock; `/painel` protegida.
- [ ] Três camadas de teste por feature; E2E com evidências PNG.
- [ ] Sem `console.log`/código morto; imports não usados removidos.
- [ ] Micro-commits atômicos, mensagens em inglês imperativo, **sem rastro de IA**.

## 11. Ordem de execução (micro-commits)

Planejamento é único; execução incremental nesta ordem sugerida:
1. **Fundação**: scaffold (package.json, next.config export, tsconfig, eslint/prettier, tailwind tema, FSD vazia), `.env.local.example`, MSW browser+server+db+handlers seed, AuthProvider mock, react-query provider, `shared/ui` base.
2. **Lista do convidado** (`/l/[token]`) + entities (evento/presente/lista) + gift-grid/gift-card/host-header + filtro/busca.
3. **Finalizar presente** + motor de reserva (idempotência/409) + confetti.
4. **RSVP** + mural de recados.
5. **Painel** (`/painel`) + CRUD de presentes + bottom-nav + proteção de rota.
6. **Landing** (`/`).
7. **E2E + evidências** de cada fluxo-âncora; revisão final.

## 12. Riscos e mitigações

- **Static export + auth**: sem servidor; sessão mock vive no client (localStorage). Ao ligar Supabase, usar PKCE + `/auth/callback` como no bolão.
- **MSW no browser em produção**: garantir que `worker.start()` só roda com a flag; nunca no build de produção real com Supabase.
- **Token de lista adivinhável**: gerar token de alta entropia mesmo no mock (não sequencial).
- **Divergência design vs. lucide**: mapear Material Symbols → lucide com tabela de equivalência ao implementar cada tela.
