# English Codebase Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) tracking.

**Goal:** Translate the entire codebase + docs to English while keeping all user-facing UI strings in pt-BR.

**Architecture:** Mechanical-but-wide rename refactor across the FSD layers. The authoritative mapping is the glossary: `docs/superpowers/specs/2026-06-20-english-codebase-glossary.md`. Each task renames ONE domain concept everywhere it appears (entity, mock, api paths, features, widgets, routes, tests, comments) and ends green.

**Tech Stack:** Next.js 16, React 19, TS, Tailwind v4, Zod, React Query, MSW, Vitest, Playwright.

## Global Constraints

- Read the glossary first — it is the verbatim source of every rename.
- **UI strings, displayed sample data, and mock HTTP `message` strings stay pt-BR.** Translate only identifiers/keys/paths/comments/test descriptions.
- Behavior unchanged: after EACH task, `pnpm type-check` + `pnpm test:run` + `pnpm lint` (0 errors) stay green.
- Use `git mv` for file/dir renames.
- Micro-commit per task; English commit message, imperative; no AI attribution, no `Co-Authored-By`. Never `git push`.
- A concept's inlined copies count: `entities/registry/model.ts` inlines Gift/Event field schemas — rename those too when renaming Gift/Event.

## Verification per task

```
pnpm type-check && pnpm test:run && pnpm lint
```
TypeScript is the primary safety net for missed references. Also grep the renamed pt-BR identifiers to confirm none remain in code (excluding UI strings / sample data / message strings).

---

## Task 1: Gift (Presente → Gift)
**Scope:** `entities/presente`→`entities/gift` (incl `format-preco.ts`→`format-price.ts`, `meta-grupo.ts`→`group-goal.ts`, `GroupGoal` fields), all Gift field keys + status values, `entities/registry` inlined gift schema, `features/gerenciar-presentes`→`features/manage-gifts` (`use-presentes`→`use-gifts`, `usePresentes`→`useGifts`, `criarPresente`/`atualizarPresente`/`removerPresente`→`createGift`/`updateGift`/`deleteGift`), `host-gift-card` + `gift-card` consumers, `formatPreco`→`formatPrice`, `percentualGrupo`→`groupGoalPercent`, mock `db.presentes`→`db.gifts`, mock paths `/api/presentes*`→`/api/gifts*` (incl `/reserva`→`/reservation`), all consuming components/tests. Keep gift display names/descriptions (pt-BR).
- [ ] Apply renames per glossary across the whole repo.
- [ ] `pnpm type-check && pnpm test:run && pnpm lint` green.
- [ ] Commit: `rename gift domain to english`.

## Task 2: Event + Dashboard (Evento → Event, Painel → Dashboard)
**Scope:** `entities/evento`→`entities/event` (`meta.ts`→`goal.ts`, `MetaEvento`→`EventGoal` + fields, `percentualMeta`→`goalPercent`, `diasRestantes`→`daysRemaining`, `rotuloContagem`→`countdownLabel`, keep `countdown.ts`/`countdown-badge.tsx`), Event field keys, `entities/registry` inlined event schema, `getPainel`→`getDashboard`, `widgets/painel`→`widgets/dashboard` (`resumo-card`→`summary-card`, `convidados-recentes`→`recent-guests`), route `app/painel`→`app/dashboard`, mock `/api/painel`→`/api/dashboard`, `db.eventos`→`db.events`, `metrics.confirmados`→`metrics.confirmed`, login redirect + any `/painel` links, all consumers/tests.
- [ ] Apply renames per glossary.
- [ ] Verify green.
- [ ] Commit: `rename event and dashboard domain to english`.

## Task 3: Registry + Guest list (Lista → Registry)
**Scope:** `entities/lista`→`entities/registry` (`Lista`→`Registry`, `getLista`→`getRegistry`, keep `token.ts`, `evento`→`event`/`presentes`→`gifts`/`host.nome`→`host.name`), `features/lista-convidado`→`features/guest-list` (`lista-convidado-screen`→`guest-list-screen`, `use-lista`→`use-registry`, `useLista`→`useRegistry`), mock `/api/lista/:token`→`/api/registry/:token`, all consumers/tests.
- [ ] Apply renames per glossary.
- [ ] Verify green.
- [ ] Commit: `rename registry domain to english`.

## Task 4: Reservation + reserve flow (Reserva → Reservation)
**Scope:** `entities/reserva`→`entities/reservation` (`Reserva`→`Reservation` + fields `presenteId`→`giftId`, `convidadoNome`→`guestName`, `recado`→`message`, `criadaEm`→`createdAt`), `features/reservar-presente`→`features/reserve-gift` (`reserva-form`→`reservation-form`, `finalizar-presente-screen`→`finalize-gift-screen`, `use-reservar`→`use-reserve-gift`, `reserva.test`→`reservation.test`, `reservarPresente`→`reserveGift`, keep `success-overlay`), route `app/l/[token]/presentear/[giftId]`→`app/l/[token]/gift/[giftId]` + nav links, mock `/api/gifts/:id/reservation` already from T1 — align reservation field keys + `db.reservas`→`db.reservations`, all consumers/tests.
- [ ] Apply renames per glossary.
- [ ] Verify green.
- [ ] Commit: `rename reservation domain to english`.

## Task 5: Message + Guest + Rsvp + misc
**Scope:** `entities/recado`→`entities/message` (`Recado`→`Message`, fields, `enviarRecado`→`sendMessage`, `getRecados`→`getMessages`), `features/recados`→`features/messages` (`recado-form`→`message-form`, `recado-list`→`message-list`, `use-recados`→`use-messages`, `useRecados`→`useMessages`), mock `/api/recados*`→`/api/messages*` + `db.recados`→`db.messages`; `entities/convidado`→`entities/guest` (`Convidado`→`Guest` + fields) + `db.convidados`→`db.guests`; Rsvp status values `confirmado`/`recusado`→`confirmed`/`declined`, `confirmarPresenca`→`confirmAttendance`, Rsvp `nome`→`name`/`eventoId`→`eventId`; `AuthUser.nome`→`name` (auth provider, sign-in DEMO_USER, mock `/api/auth/google` user, login-cta, nav, painel greeting); landing widget children renames (`como-funciona`→`how-it-works`, `inspiracao`→`inspiration`, `seguranca`→`security`, `depoimentos`→`testimonials`); translate ALL remaining pt-BR test `describe`/`it` strings and code comments to English; rename e2e dirs/files/specs identifiers where pt-BR (keep pt-BR assertion strings that match UI). Keep all UI strings pt-BR.
- [ ] Apply renames per glossary.
- [ ] Verify green + full `pnpm test:e2e`.
- [ ] Commit: `rename remaining domains and translate code comments to english`.

## Task 6: Docs to English
**Scope:** Translate prose to English in `CLAUDE.md`, `design/00-design-system.md`, and files under `docs/superpowers/specs` + `docs/superpowers/plans` (keep quoted pt-BR UI samples). Keep design PNGs.
- [ ] Translate.
- [ ] Commit: `translate project docs to english`.

## Final: whole-branch review
- [ ] `pnpm type-check && pnpm lint && pnpm test:run && pnpm test:e2e` all green.
- [ ] Grep guard: no residual pt-BR identifiers in code (status values, field keys, function names) outside UI strings/sample data/message strings.
- [ ] Dispatch final whole-branch reviewer.

## Self-review (author)
- Coverage: every concept in the glossary maps to a task (T1 Gift, T2 Event/Dashboard, T3 Registry, T4 Reservation, T5 Message/Guest/Rsvp/Auth/landing/comments/e2e, T6 docs). ✓
- Ordering minimizes breakage; registry inlined schemas handled in T1/T2; type-check gate after each. ✓
- UI-string preservation called out in global constraints and each task. ✓
