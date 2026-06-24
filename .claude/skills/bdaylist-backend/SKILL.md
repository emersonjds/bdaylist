---
name: bdaylist-backend
description: Use ao implementar ou revisar QUALQUER feature de backend do BdayList no Supabase (Postgres + RLS + Edge Functions). Cobre motor de reserva atômico/idempotente, modelo de dados, contratos de RPC/endpoint, notificações e enriquecimento de link. Invoque para reserva/cancelamento de presente, RSVP, recados, jobs/cron, e quando o frontend precisar do shape correto dos payloads.
---

# Backend do BdayList (Supabase)

Plataforma decidida no ADR: **SPA static export + Supabase Cloud (Postgres + RLS + Edge Functions), região `sa-east-1`**. Sem dinheiro no escopo ("presentear" = reservar). Specs completas em `docs/backend/`.

## Onde mora cada coisa

| Responsabilidade                                  | Onde                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------- |
| Leitura pública (por token), RSVP, painel do host | cliente `supabase-js` **sob RLS** / RPC `SECURITY DEFINER`                |
| Reserva / cancelamento (atômico)                  | **Postgres function** via RPC, chamada por Edge Function (`service_role`) |
| E-mail, enrich de link (anti-SSRF), jobs          | **Edge Functions** + `pg_cron`                                            |
| Segredos (`RESEND_API_KEY`, `service_role`)       | só em env de Edge Function — **nunca** `NEXT_PUBLIC_*`                    |

## Regras inegociáveis

1. **Reserva é server-authoritative, atômica, idempotente, anti-TOCTOU.** Nunca checar disponibilidade no app e gravar depois. Garantia no banco:
   - índice **único parcial** em reservas ativas (impõe a invariante no schema);
   - `SELECT ... FOR UPDATE` no presente para serializar concorrentes e devolver `ALREADY_RESERVED` rastreável;
   - replay por `idempotency_key` (UUID v4 do cliente, 1 por form) **antes** do lock.
   - Ver `docs/backend/specs/02-motor-de-reserva.md` (DDL + função `reserve_gift`).
2. **Status do presente é derivado** das reservas (view/trigger), nunca uma coluna solta que pode dessincronizar.
3. **Presente em grupo** = N reservas por cota/slot; a unicidade muda de "uma por presente" para "uma por slot".
4. **Idempotência de e-mail** via `notification_log` + `on conflict do nothing`.
5. **Enrich de link nunca quebra o cadastro** — degrada para manual; allowlist anti-SSRF + `redirect:'error'` + timeout 3s + sanitização de metadados.
6. **Conexões via pooler** (porta 6543), nunca conexão direta do cliente.

## Contratos

Endpoints/RPCs e envelope de erro em `docs/backend/specs/05-contratos-endpoints.md`. DTOs espelham `src/entities/*/model.ts` e os handlers MSW em `src/mocks/handlers.ts` (snake_case no banco → camelCase no JSON).

## Antes de concluir (quality gate)

- [ ] Reserva concorrente testada: 201 + 409 (sem reserva dupla).
- [ ] `GET /registry/:token` não vaza `listToken` no corpo, nem `guests[].email`, nem quem reservou quando `surprise_mode`.
- [ ] Migrations em `supabase/migrations/`, idempotentes.
- [ ] Nenhuma tabela sem RLS (ver skill [[bdaylist-rls-seguranca]]).
- [ ] Testes nas 3 camadas (unit, integração MSW, E2E Playwright com prints).

Acione o agent `back` para implementar e `dba` para decisões de schema/índices/concorrência.
