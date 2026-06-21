# English Codebase Refactor — Glossary & Rules

**Date:** 2026-06-20
**Goal:** All code in English (identifiers, files, directories, comments, test
descriptions, routes, mock API paths) and docs in English — while ALL
user-facing UI text stays in Brazilian Portuguese (pt-BR).

## Hard rules

1. **UI strings stay pt-BR.** Any string rendered to the user (JSX text,
   `placeholder`, `aria-label`, button labels, headings, toast/empty/error copy
   shown on screen) must remain Portuguese. Do NOT translate these.
2. **Sample/content data stays pt-BR.** Seed values that are displayed
   (gift names like "Fone Bluetooth Premium", descriptions, host name
   "Rodrigo", the sample `listToken` value `festa-rodrigo-25`) are content —
   keep them. Only rename the *keys/identifiers*, never these display *values*.
3. **Mock HTTP error `message` strings stay pt-BR** (they may surface to the
   user). Rename the API *paths* and *field keys*, not the human messages.
4. **Everything else becomes English:** type names, interfaces, variables,
   functions, hooks, file names, directory names, route segments, mock API
   paths, object property keys, enum *values* that are internal (status), Zod
   schema names, test `describe`/`it` descriptions, and all code comments.
5. **Behavior must not change.** After each task `pnpm type-check`,
   `pnpm test:run` and `pnpm lint` (0 errors) stay green; e2e still passes.
6. Use `git mv` for file/dir renames so history is preserved.

## Domain type map

| pt-BR | English |
|---|---|
| Presente | Gift |
| Evento | Event |
| Lista | Registry |
| Reserva | Reservation |
| Rsvp | Rsvp (unchanged) |
| Recado | Message |
| Convidado | Guest |
| Aniversariante / host | Host |
| MetaEvento | EventGoal |
| MetaGrupo | GroupGoal |
| AuthUser | AuthUser (unchanged) |

## Field / property key map

**Gift** (`Presente`): `nome`→`name`, `descricao`→`description`,
`imagemUrl`→`imageUrl`, `precoReferencia`→`referencePrice`,
`linkLoja`→`storeLink`, `maisDesejado`→`mostWanted`, `emGrupo`→`isGroup`,
`eventoId`→`eventId`, `metaGrupo`→`groupGoal`.
Status enum values: `"disponivel"`→`"available"`, `"reservado"`→`"reserved"`.

**GroupGoal** (`MetaGrupo`): `alvo`→`target`, `arrecadado`→`collected`.

**Event** (`Evento`): `titulo`→`title`, `dataAniversario`→`birthDate`,
`tema`→`theme`, `mensagem`→`message`, `capaUrl`→`coverUrl`, `meta`→`goal`.
Keep: `hostId`, `listToken`.

**EventGoal** (`MetaEvento`): `alvo`→`target`, `atingido`→`reached`.

**Registry** (`Lista`): `evento`→`event`, `presentes`→`gifts`,
`host.nome`→`host.name`. (The inlined schemas in this model must mirror the
Gift/Event key renames above.)

**Reservation** (`Reserva`): `presenteId`→`giftId`,
`convidadoNome`→`guestName`, `recado`→`message`, `criadaEm`→`createdAt`.
Keep: `idempotencyKey`.

**Rsvp**: `eventoId`→`eventId`, `nome`→`name`.
Status values: `"confirmado"`→`"confirmed"`, `"recusado"`→`"declined"`.

**Message** (`Recado`): `eventoId`→`eventId`, `autor`→`author`,
`texto`→`text`, `criadoEm`→`createdAt`.

**Guest** (`Convidado`): `eventoId`→`eventId`, `nome`→`name`. Keep `email`.

**AuthUser**: `nome`→`name`. Keep `id`, `email`, `avatarUrl`.

**Metrics**: `confirmados`→`confirmed`.

## Function / hook / helper map

| pt-BR | English |
|---|---|
| usePresentes | useGifts |
| criarPresente | createGift |
| atualizarPresente | updateGift |
| removerPresente | deleteGift |
| useLista | useRegistry |
| getLista | getRegistry |
| useReservar | useReserveGift |
| reservarPresente | reserveGift |
| useRsvp | useRsvp (unchanged) |
| confirmarPresenca | confirmAttendance |
| useRecados | useMessages |
| enviarRecado | sendMessage |
| getRecados | getMessages |
| getPainel | getDashboard |
| diasRestantes | daysRemaining |
| rotuloContagem | countdownLabel |
| percentualMeta | goalPercent |
| percentualGrupo | groupGoalPercent |
| formatPreco | formatPrice |

## File / directory map

**entities:** `presente`→`gift` (`format-preco.ts`→`format-price.ts`,
`meta-grupo.ts`→`group-goal.ts`); `evento`→`event` (`meta.ts`→`goal.ts`,
keep `countdown.ts`, `countdown-badge.tsx`); `lista`→`registry`
(keep `token.ts`); `reserva`→`reservation`; `recado`→`message`;
`convidado`→`guest`; `rsvp` unchanged.

**features:** `gerenciar-presentes`→`manage-gifts`
(`use-presentes.ts`→`use-gifts.ts`); `lista-convidado`→`guest-list`
(`lista-convidado-screen.tsx`→`guest-list-screen.tsx`, `use-lista.ts`→
`use-registry.ts`, keep `gift-card`, `search-box`, `price-filter`);
`recados`→`messages` (`recado-form.tsx`→`message-form.tsx`,
`recado-list.tsx`→`message-list.tsx`, `use-recados.ts`→`use-messages.ts`);
`reservar-presente`→`reserve-gift` (`reserva-form.tsx`→`reservation-form.tsx`,
`finalizar-presente-screen.tsx`→`finalize-gift-screen.tsx`,
`use-reservar.ts`→`use-reserve-gift.ts`, `reserva.test.ts`→
`reservation.test.ts`, keep `success-overlay.tsx`); `rsvp`, `auth` unchanged.

**widgets:** `painel`→`dashboard` (`resumo-card.tsx`→`summary-card.tsx`,
`convidados-recentes.tsx`→`recent-guests.tsx`, `meta-card.tsx` keep);
`landing` children `como-funciona.tsx`→`how-it-works.tsx`,
`inspiracao.tsx`→`inspiration.tsx`, `seguranca.tsx`→`security.tsx`,
`depoimentos.tsx`→`testimonials.tsx` (keep `nav`, `hero`, `faq`, `footer`);
keep `app-shell`, `gift-grid`, `host-header`.

## Routes (app/)

- `app/painel` → `app/dashboard`
- `app/l/[token]/presentear/[giftId]` → `app/l/[token]/gift/[giftId]`
- `app/l/[token]` unchanged

Any in-app navigation/link to these (`router.push("/painel")`,
`/l/${token}/presentear/...`, the login redirect, share-link builder) must be
updated accordingly.

## Mock API paths (mocks/handlers.ts + every fetcher in entities/*/api.ts)

- `/api/lista/:token` → `/api/registry/:token`
- `/api/painel` → `/api/dashboard`
- `/api/presentes` → `/api/gifts`
- `/api/presentes/:id` → `/api/gifts/:id`
- `/api/presentes/:id/reserva` → `/api/gifts/:id/reservation`
- `/api/recados/:eventoId` → `/api/messages/:eventId`
- `/api/recados` → `/api/messages`
- `/api/rsvp`, `/api/auth/google` unchanged

## Mock db (mocks/db.ts) collections

`eventos`→`events`, `presentes`→`gifts`, `convidados`→`guests`,
`reservas`→`reservations`, `recados`→`messages`, `rsvps` unchanged.

## Docs to translate to English (last task)

`CLAUDE.md`, `design/00-design-system.md`, and the files under
`docs/superpowers/specs` and `docs/superpowers/plans`. Keep design PNG content
as-is; PNG filenames may stay. Translate prose; keep product/UI string examples
that are quoted as pt-BR samples.
