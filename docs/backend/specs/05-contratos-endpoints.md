# Spec 05 — Contratos de endpoints/RPCs

| Operação | Método | Path | Auth | Input | Output |
|---|---|---|---|---|---|
| Lista pública | GET | `/api/registry/:token` | listToken (path) | — | `RegistryResponse` |
| Dashboard do host | GET | `/api/dashboard` | JWT host | — | `{ event, gifts, guests, metrics }` |
| Criar evento | POST | `/api/events` | JWT host | `CreateEventRequest` | `{ event }` |
| Atualizar evento | PATCH | `/api/events/:id` | JWT host (próprio) | `UpdateEventRequest` | `{ event }` |
| Criar presente | POST | `/api/gifts` | JWT host | `CreateGiftRequest` | `{ gift }` |
| Atualizar presente | PATCH | `/api/gifts/:id` | JWT host (próprio evento) | `UpdateGiftRequest` | `{ gift }` |
| Remover presente | DELETE | `/api/gifts/:id` | JWT host (próprio evento) | — | `{ success }` |
| **Reservar presente** | POST | `/api/gifts/:id/reservation` | listToken (body) | `ReserveGiftRequest` | `ReserveGiftResponse` (201/200/409) |
| **Cancelar reserva** | DELETE | `/api/gifts/:giftId/reservation` | listToken + guestName | `CancelReservationRequest` | `{ success }` |
| RSVP | POST | `/api/rsvp` | listToken (body) | `SubmitRsvpRequest` | `{ rsvp }` |
| Listar recados | GET | `/api/messages/:eventId` | listToken (query) | — | `{ messages }` |
| Criar recado | POST | `/api/messages` | listToken (body) | `MessageBody` | `{ message }` |
| Adicionar convidado | POST | `/api/guests` | JWT host | `CreateGuestInput` | `{ guest }` |
| Enriquecer link | POST | `/api/enrich-link` | JWT host | `{ url }` | `EnrichLinkResponse` |
| Auth Google | POST | `/api/auth/google` | — | `{ code }` | `{ user, token }` |

## Operações críticas

**`POST /api/gifts/:id/reservation`** → `reserve_gift(...)` numa transação. 201 nova / 200 replay / 409 conflito. Nunca retorna `guestEmail` do reservante.
**`DELETE /api/gifts/:giftId/reservation`** → `cancel_reservation(...)`. 404 inexistente/cancelada; 403 identidade não bate.
**`GET /api/registry/:token`** → função `SECURITY DEFINER` `get_registry`. Nunca expõe `guestEmail`; expõe `guestName` só quando `surpriseMode=false`; `groupGoal.collected` calculado em runtime.
**`POST /api/enrich-link`** → sempre 200 (`source:'failed'` em falha); só host (link é info do aniversariante).

## Envelope de erro

```typescript
interface ApiError { message: string; code: string; details?: unknown }  // message em PT-BR
```

| `ERRCODE` Postgres | HTTP |
|---|---|
| `P0001` GIFT_NOT_FOUND | 404 |
| `P0002` ALREADY_RESERVED | 409 |
| `P0003` GROUP_FULL | 409 |
| `P0004` VALIDATION_ERROR | 422 |
| `P0010` RESERVATION_NOT_FOUND | 404 |
| `P0011` NOT_AUTHORIZED | 403 |
| `23505` unique_violation | 409 (fallback do constraint) |
