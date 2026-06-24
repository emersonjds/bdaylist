# ADR 0003 — Segurança e LGPD do backend

- **Status:** Aceito
- **Data:** 2026-06-23
- **Decisor:** `redteam` (com `arq`, `back`)
- **Relacionado:** [ADR 0001](0001-plataforma-de-backend.md) · [ADR 0002](0002-escolha-de-banco.md)
- **Escopo:** threat modeling defensivo/autorizado.

---

## 1. Onde mora a autorização (por arquitetura)

| | (A) SPA + Supabase (escolhida) | (B) SPA + backend dedicado |
|---|---|---|
| Fronteira de segurança | **RLS no Postgres** (chave publishable é pública por design) | Middleware de authz no servidor (banco não exposto) |
| Modo de falha | RLS esquecida numa tabela nova → tudo vaza, **sem erro visível** | Middleware esquecido num endpoint → endpoint exposto, **testável** |
| Defesa em profundidade | RLS + Edge Function (`service_role`) = 2 camadas | Backend + regra de serviço = 1 camada clara |
| Custo do erro humano | Um `using (true)` numa policy = todos os dados | Omissão de um middleware = um endpoint |

**Veredito:** (A) é adequada para o estágio **se** os P0 abaixo forem implementados antes do primeiro usuário real. RLS incompleta em produção é pior que qualquer outra decisão de arquitetura.

---

## 2. Threat model das funcionalidades críticas (STRIDE enxuto)

| Funcionalidade | Ameaça | Mitigação |
|---|---|---|
| **Reserva** | Race / reserva dupla (TOCTOU) | Índice único parcial + `SELECT FOR UPDATE` na RPC |
| | Cancelar reserva alheia (IDOR) | RLS/authz: só a própria reserva; auth de convidado quando houver |
| | Marcar `status` direto via PostREST | Escrita de reserva só via Edge Function/RPC (`service_role`); RLS bloqueia UPDATE de `status` pelo cliente |
| **Link de compartilhamento** | Token adivinhável / enumerável | `crypto.getRandomValues(16)` = 128 bits; **nunca** token semântico (o seed de mock `festa-rodrigo-25` não pode ir p/ produção) |
| | Varredura de tokens (DoS/custo) | Rate limit por IP no `GET /registry/:token` |
| | Token redundante no corpo da resposta | Não devolver `listToken` no payload (já está na URL) |
| **RSVP / PII** | E-mails de convidados expostos | RLS: só o host do evento lê `guests`; nunca via anon key |
| | Quebra da "surpresa" | Resposta omite quem reservou quando `surprise_mode = true` |
| **Enriquecimento de link** | SSRF (IP interno / `169.254.169.254`) | Allowlist: só http/https, bloquear IP privado/CGNAT, resolver DNS antes do fetch, **sem seguir redirect**, timeout 3s |
| | XSS persistente via `og:title` | Sanitizar metadados (texto puro) antes de gravar |

---

## 3. LGPD

| Tema | Decisão |
|---|---|
| **Residência de dados** | Supabase **`sa-east-1` (São Paulo)** → sem transferência internacional, sem necessidade de SCCs. (Região é **irreversível** após criar o projeto — escolher São Paulo no setup.) |
| **Dados pessoais** | Nome e e-mail de convidados; nome/e-mail do host; mensagens. |
| **Bases legais** | Host: execução de contrato. Convidado: consentimento no ato do RSVP (aviso + link p/ política). |
| **Minimização** | RSVP coleta só o necessário; não expor e-mail de um convidado a outro. |
| **Retenção / exclusão** | `DELETE /account` para o host; anonimização da reserva/recado do convidado ao cancelar; política de anonimizar evento passado após ~90 dias. |
| **DPA** | Assinar o DPA padrão do Supabase no dashboard. |

---

## 4. Hardening priorizado

### P0 — antes de qualquer usuário real
1. **Índice único parcial** na reserva (race condition) — ver [ADR 0002](0002-escolha-de-banco.md).
2. **RLS habilitada e fail-closed em TODAS as tabelas.** Auditar tabela sem policy:
   ```sql
   select tablename from pg_tables
   where schemaname = 'public'
     and not exists (select 1 from pg_policies where tablename = pg_tables.tablename);
   ```
3. **Remover `listToken` do corpo** de `GET /registry/:token`.
4. **Validação anti-SSRF** antes de qualquer enriquecimento de link.
5. **Ownership check** em mutações de presente (o gift pertence ao evento do host).

### P1 — sprint seguinte
6. **Rate limiting por IP** (registry 60/min, RSVP 5/min, recados 10/min, reserva 3/min).
7. **Não expor e-mails de convidados** a outros convidados; dashboard com e-mail só p/ host autenticado.
8. **Headers de segurança** no Netlify (`netlify.toml`): CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.
9. **Sanitização anti-XSS** de todo input renderizado (título, mensagem, nome/descrição de presente, recado).
10. **Teste de entropia** do token de share (≥128 bits, só chars base64url).

### P2 — antes de escalar
11. Mecanismo de **direito de exclusão** (LGPD Art. 18) + retenção automática.
12. **CORS** explícito (origem do SPA), nunca `*` em endpoint autenticado.
13. Cookie de sessão do host `HttpOnly; Secure; SameSite=Lax` (via `@supabase/ssr`).
14. Desabilitar **introspection** do PostgREST em produção.
15. Confirmar **`sa-east-1`** na criação do projeto.

---

## 5. Testes de segurança a adicionar

| Camada | Teste |
|---|---|
| Unit | `generateListToken()` ≥ 22 chars, só base64url; `validateStoreUrl()` rejeita `169.254.169.254`, `file://`, IP 10.x |
| Integração (MSW) | `POST /reservation` simultâneo → 201 + 409; `GET /registry/:token` não retorna `listToken` nem `guests[].email`; `GET /dashboard` sem auth → 401; `PATCH /gifts/:id` de outro evento → 403 |
| E2E (Playwright) | reserva concorrente mostra "reservado" sem nome; recado com `<script>` renderiza como texto |
| Pentest manual | flood de RSVP → 429; `storeLink=http://169.254.169.254/...` → rejeitado; `GET /rest/v1/guests` com anon key → 0 linhas (RLS) |

---

## Fontes (2026-06-23)

[Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) · [Supabase regiões](https://supabase.com/docs/guides/platform/regions) · [ANPD — transferência internacional](https://www.gov.br/anpd/pt-br/assuntos/assuntos-internacionais/transferencia-internacional-de-dados) · CWE-362, CWE-639, CWE-918, CWE-79, CWE-359, CWE-287.
