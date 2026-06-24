# Spec 04 — Integrações

## 1. Enriquecimento de link de loja (Open Graph)

Falha **nunca** quebra o cadastro → degrada para entrada manual.

**Allowlist anti-SSRF (obrigatória antes de qualquer fetch):**

```typescript
const BLOCKED_RANGES = [
  /^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./, /^127\./,
  /^169\.254\./,        // link-local / metadata cloud (AWS/GCP/Azure)
  /^::1$/, /^fc00:/, /^fe80:/,
];
const BLOCKED_SUFFIXES = ['.internal', '.local', '.localhost', '.corp'];

async function isSafeUrl(raw: string): Promise<boolean> {
  let u: URL;
  try { u = new URL(raw); } catch { return false; }
  if (!['http:', 'https:'].includes(u.protocol)) return false;
  if (BLOCKED_SUFFIXES.some(s => u.hostname.endsWith(s))) return false;
  const ips = await Deno.resolveDns(u.hostname, 'A').catch(() => []); // resolve antes (anti-rebinding)
  return !ips.some(ip => BLOCKED_RANGES.some(r => r.test(ip)));
}
```

**Fluxo:** `isSafeUrl` → cache (TTL 24h em `url_enrichment_cache`) → `fetch` com timeout 3s, 1 retry com backoff, **`redirect: 'error'`** (não seguir redirect) → `parseOpenGraph` → upsert no cache. Se falhar, retorna `{ source: 'failed' }` e a UI abre o formulário manual. **Sanitizar** `og:title` (texto puro) antes de gravar — anti-XSS.

No Supabase roda em Edge Function (Deno, `Deno.resolveDns`); no backend dedicado, Node (`dns.promises.resolve4`).

## 2. Notificações por e-mail

| `event_type` | `reference_id` | Trigger | Destinatário |
|---|---|---|---|
| `rsvp_confirmed` | `rsvp.id` | RSVP criado | host |
| `gift_reserved` | `reservation.id` | reserva criada | host + convidado (se e-mail) |
| `reminder_d7` | `event.id` | D-7 antes de `birth_date` | RSVPs confirmados |
| `reminder_d1` | `event.id` | D-1 antes de `birth_date` | RSVPs confirmados |

**Idempotência (não duplicar):**

```sql
insert into notification_log (event_type, reference_id)
values ($1, $2) on conflict (event_type, reference_id) do nothing
returning id;     -- sem linha = já enviado, pular
```

**Agendamento (Supabase):** `pg_cron` chama uma Edge Function `send-reminders` 1x/dia; ela consulta eventos em D-7/D-1, checa `notification_log` e envia via **Resend**.

**Segredos** (`RESEND_API_KEY`, `FROM_EMAIL`) só nas env vars da Edge Function — **nunca** em `NEXT_PUBLIC_*` nem no frontend.
