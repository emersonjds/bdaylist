---
name: bdaylist-rls-seguranca
description: Use ao criar/alterar tabelas, policies RLS, Edge Functions ou qualquer superfície que toque PII de convidados, token de compartilhamento, ou enriquecimento de link no BdayList. Garante RLS fail-closed, privacidade da opção "surpresa", anti-SSRF/XSS e conformidade LGPD (dados em São Paulo). Invoque antes de mergear qualquer mudança de schema ou de autorização.
---

# RLS, segurança e LGPD do BdayList

A fronteira de segurança da arquitetura escolhida (SPA + Supabase) é a **RLS no Postgres** — a chave publishable é pública por design. RLS esquecida numa tabela nova **expõe tudo, sem erro visível**. Tratar como disciplina obrigatória. Detalhe em `docs/backend/adr/0003-seguranca-e-lgpd.md`.

## P0 — antes de qualquer usuário real

1. **Índice único parcial** na reserva (anti race) — ver [[bdaylist-backend]].
2. **RLS habilitada e fail-closed em TODAS as tabelas.** Toda tabela nova nasce com `enable row level security` + policy explícita. Auditar:
   ```sql
   select tablename from pg_tables
   where schemaname = 'public'
     and not exists (select 1 from pg_policies where tablename = pg_tables.tablename);
   ```
3. **Não devolver `listToken` no corpo** de `GET /registry/:token` (já está na URL).
4. **Anti-SSRF** antes de qualquer enrich de link (allowlist, sem redirect, timeout, resolver DNS antes).
5. **Ownership check** em mutações de presente (gift pertence ao evento do host).

## Privacidade

- **Surpresa** (`surprise_mode`): a resposta omite quem reservou (na camada de resposta, não em RLS complexa). `reservation_log` guarda histórico, nunca exposto.
- **PII de convidado** (nome/e-mail): só o host do evento lê `guests`; nunca via anon key; nunca expor e-mail de um convidado a outro.
- Use `(select auth.uid())` nas policies (avaliação única por query).

## Token de compartilhamento

128 bits CSPRNG (`crypto.getRandomValues(16)`), base64url. **Nunca** semântico/derivado de id/data/nome. O seed `festa-rodrigo-25` é só mock — não vai para produção. Rate limit por IP no `GET /registry/:token`.

## LGPD

- **Região `sa-east-1` (São Paulo)** na criação do projeto (irreversível) → sem transferência internacional, sem SCCs.
- Consentimento no RSVP (aviso + link p/ política); minimização; `DELETE /account` e anonimização de reserva/recado; assinar DPA do Supabase.

## Hardening (P1/P2)

Rate limiting por rota; headers de segurança no `netlify.toml` (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy); sanitização anti-XSS de todo input renderizado; CORS explícito; cookie de sessão `HttpOnly; Secure; SameSite=Lax`; desabilitar introspection do PostgREST.

## Testes de segurança

`GET /rest/v1/guests` com anon key → 0 linhas; `storeLink=http://169.254.169.254/...` → rejeitado; flood de RSVP → 429; reserva concorrente mostra "reservado" sem nome. Acione `redteam` para threat model e `qa` para validar em tela.
