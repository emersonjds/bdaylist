# Redesign Stitch (3 telas) + Login Flow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Atualizar 3 telas (painel, lista do convidado, checkout) para baterem com os designs Stitch e fazer o botão "Entrar" autenticar e levar o usuário ao seu painel.

**Architecture:** Mantém Feature-Sliced Design, backend mock (MSW) e os 3 layers de teste. Dinheiro permanece fora do app: campos de pagamento são decorativos/desabilitados, metas e "% arrecadado" são exibição read-only, e o fluxo do convidado continua sendo **reserva**.

**Tech Stack:** Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind v4 (`@theme` em `globals.css`), Zod, React Query, lucide-react, MSW, Vitest + Testing Library, Playwright.

## Global Constraints

- **UI 100% em PT-BR.** Sem texto em inglês visível.
- **Sem `any`** (use `unknown` + narrowing). Props sempre com interface nomeada.
- **Tokens do design system** (`primary`, `secondary`, `tertiary`, `confetti-*`, surfaces, Montserrat). Sem cores hardcoded fora dos tokens.
- **Sem dinheiro real:** nenhum gateway/PIX funcional; campos de pagamento são markup `disabled`. Sucesso do checkout = **"Presente Reservado!"** (nunca "Enviado").
- **FSD:** só importar de layers abaixo (`app → widgets → features → entities → shared`). Nunca lateral/acima.
- **Sem `console.log`/código morto; imports não usados removidos.**
- **Gate por task:** `pnpm type-check` e `pnpm lint` sem erros; `pnpm test:run` verde.
- **Micro-commit ao fim de cada task** — mensagem em inglês, imperativo curto, **sem menção a IA/Claude/Anthropic**, sem rodapé `Co-Authored-By`. **Nunca `git push`** (push é do humano).
- **Visual de referência (fonte de verdade):** os HTML do Stitch em
  `/Users/emerson/Downloads/stitch_birthday_gift_registry/code.html` (painel),
  `/Users/emerson/Downloads/stitch_birthday_gift_registry (1)/tela1.html` (lista convidado),
  `/Users/emerson/Downloads/stitch_birthday_gift_registry (2)/tela2.html` (checkout).
  Traduza a estrutura/visual desses arquivos usando os primitivos e tokens do projeto.

---

## File Structure

| Arquivo | Responsabilidade | Ação |
|---------|------------------|------|
| `src/entities/evento/model.ts` | + `meta?` no schema/tipo | Modificar |
| `src/entities/evento/meta.ts` | helper `percentualMeta` | Criar |
| `src/entities/evento/meta.test.ts` | unit do helper | Criar |
| `src/entities/evento/index.ts` | exportar helper | Modificar |
| `src/entities/presente/model.ts` | + `metaGrupo?` no schema/tipo | Modificar |
| `src/entities/presente/meta-grupo.ts` | helper `percentualGrupo` | Criar |
| `src/entities/presente/meta-grupo.test.ts` | unit do helper | Criar |
| `src/entities/presente/index.ts` | exportar helper | Modificar |
| `src/mocks/db.ts` | dados de meta/metaGrupo (read-only) | Modificar |
| `src/shared/ui/progress-bar.tsx` | barra de progresso reutilizável | Criar |
| `src/shared/ui/progress-bar.test.tsx` | unit do ProgressBar | Criar |
| `src/shared/ui/index.ts` | exportar ProgressBar | Modificar |
| `src/widgets/landing/nav.tsx` | "Entrar" → login → `/painel` | Modificar |
| `src/widgets/painel/meta-card.tsx` | card "Meta de Presentes" | Criar |
| `src/widgets/painel/meta-card.test.tsx` | unit do MetaCard | Criar |
| `src/app/painel/page.tsx` | usar MetaCard no slot col-span-2 | Modificar |
| `src/features/gerenciar-presentes/host-gift-card.tsx` | "% Arrecadado" + footer fiel | Modificar |
| `src/features/lista-convidado/gift-card.tsx` | bento, grupo (progresso + Contribuir), confetti | Modificar |
| `src/features/lista-convidado/lista-convidado-screen.tsx` | balões de fundo + grid bento | Modificar |
| `src/widgets/host-header/host-header.tsx` | hero com avatar + selo 🎂 | Modificar |
| `src/features/reservar-presente/finalizar-presente-screen.tsx` | bloco pagamento decorativo + subtotal/total | Modificar |
| `src/features/reservar-presente/reserva-form.tsx` | botão "Confirmar Reserva" | Modificar |
| `src/features/reservar-presente/success-overlay.tsx` | copy "Presente Reservado!" | Modificar |
| `e2e/auth/*`, `e2e/lista/*`, `e2e/reserva/*` | e2e + PNGs | Criar/Modificar |

---

## Task 1: Modelo de dados read-only (meta do evento + meta de grupo)

**Files:**
- Modify: `src/entities/evento/model.ts`
- Create: `src/entities/evento/meta.ts`, `src/entities/evento/meta.test.ts`
- Modify: `src/entities/evento/index.ts`
- Modify: `src/entities/presente/model.ts`
- Create: `src/entities/presente/meta-grupo.ts`, `src/entities/presente/meta-grupo.test.ts`
- Modify: `src/entities/presente/index.ts`
- Modify: `src/mocks/db.ts`

**Interfaces:**
- Produces: `MetaEvento = { alvo: number; atingido: number }`, `Evento.meta?: MetaEvento`
- Produces: `MetaGrupo = { alvo: number; arrecadado: number }`, `Presente.metaGrupo?: MetaGrupo`
- Produces: `percentualMeta(meta: MetaEvento): number` (0–100, inteiro, clamp)
- Produces: `percentualGrupo(meta: MetaGrupo): number` (0–100, inteiro, clamp)

- [ ] **Step 1: Failing test — `percentualMeta`**

Create `src/entities/evento/meta.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { percentualMeta } from "./meta";

describe("percentualMeta", () => {
  it("calcula o percentual atingido arredondado", () => {
    expect(percentualMeta({ alvo: 5000, atingido: 2450 })).toBe(49);
  });
  it("retorna 0 quando alvo é 0", () => {
    expect(percentualMeta({ alvo: 0, atingido: 100 })).toBe(0);
  });
  it("limita o teto em 100", () => {
    expect(percentualMeta({ alvo: 100, atingido: 250 })).toBe(100);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `pnpm test:run src/entities/evento/meta.test.ts`
Expected: FAIL ("percentualMeta is not a function" / module not found).

- [ ] **Step 3: Implement helper + type**

Create `src/entities/evento/meta.ts`:
```ts
export interface MetaEvento {
  alvo: number;
  atingido: number;
}

export function percentualMeta(meta: MetaEvento): number {
  if (meta.alvo <= 0) return 0;
  return Math.min(100, Math.round((meta.atingido / meta.alvo) * 100));
}
```

Modify `src/entities/evento/model.ts` — add the optional field:
```ts
import { z } from "zod";

export const MetaEventoSchema = z.object({
  alvo: z.number(),
  atingido: z.number(),
});

export const EventoSchema = z.object({
  id: z.string(),
  hostId: z.string(),
  titulo: z.string(),
  dataAniversario: z.string(),
  tema: z.string(),
  mensagem: z.string(),
  capaUrl: z.string(),
  listToken: z.string(),
  meta: MetaEventoSchema.optional(),
});

export type Evento = z.infer<typeof EventoSchema>;
```

- [ ] **Step 4: Failing test — `percentualGrupo`**

Create `src/entities/presente/meta-grupo.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { percentualGrupo } from "./meta-grupo";

describe("percentualGrupo", () => {
  it("calcula o percentual arrecadado arredondado", () => {
    expect(percentualGrupo({ alvo: 1500, arrecadado: 600 })).toBe(40);
  });
  it("retorna 0 quando alvo é 0", () => {
    expect(percentualGrupo({ alvo: 0, arrecadado: 50 })).toBe(0);
  });
  it("limita o teto em 100", () => {
    expect(percentualGrupo({ alvo: 100, arrecadado: 300 })).toBe(100);
  });
});
```

- [ ] **Step 5: Implement `percentualGrupo` + type**

Create `src/entities/presente/meta-grupo.ts`:
```ts
export interface MetaGrupo {
  alvo: number;
  arrecadado: number;
}

export function percentualGrupo(meta: MetaGrupo): number {
  if (meta.alvo <= 0) return 0;
  return Math.min(100, Math.round((meta.arrecadado / meta.alvo) * 100));
}
```

Modify `src/entities/presente/model.ts` — add optional field:
```ts
import { z } from "zod";

export const MetaGrupoSchema = z.object({
  alvo: z.number(),
  arrecadado: z.number(),
});

export const PresenteSchema = z.object({
  id: z.string(),
  eventoId: z.string(),
  nome: z.string(),
  descricao: z.string(),
  imagemUrl: z.string(),
  precoReferencia: z.number(),
  linkLoja: z.string(),
  maisDesejado: z.boolean(),
  emGrupo: z.boolean(),
  status: z.enum(["disponivel", "reservado"]),
  metaGrupo: MetaGrupoSchema.optional(),
});

export type Presente = z.infer<typeof PresenteSchema>;
```

- [ ] **Step 6: Export helpers**

In `src/entities/evento/index.ts` add: `export { percentualMeta, type MetaEvento } from "./meta";`
In `src/entities/presente/index.ts` add: `export { percentualGrupo, type MetaGrupo } from "./meta-grupo";`
(Keep existing exports; verify with a quick read first.)

- [ ] **Step 7: Seed mock data (read-only)**

In `src/mocks/db.ts`, on the `evento-1` object add:
```ts
        meta: { alvo: 5000, atingido: 2450 },
```
On gift `p4` (Cafeteira, `emGrupo: true`) add:
```ts
        metaGrupo: { alvo: 1500, arrecadado: 600 },
```

- [ ] **Step 8: Run all tests + type-check**

Run: `pnpm test:run src/entities && pnpm type-check`
Expected: PASS. (Verify MSW handlers already serialize whole `evento`/`presente` objects so the new fields flow through; if a handler maps fields explicitly, add `meta`/`metaGrupo`.)

- [ ] **Step 9: Commit**

```bash
git add src/entities/evento src/entities/presente src/mocks/db.ts
git commit -m "add read-only gift goal data to event and group gifts"
```

---

## Task 2: ProgressBar (shared/ui)

**Files:**
- Create: `src/shared/ui/progress-bar.tsx`, `src/shared/ui/progress-bar.test.tsx`
- Modify: `src/shared/ui/index.ts`

**Interfaces:**
- Produces: `ProgressBar({ value, className, label }: { value: number; className?: string; label?: string })` — `value` 0–100, gradiente `from-secondary-fixed-dim to-primary-container`, `role="progressbar"` com `aria-valuenow`.

- [ ] **Step 1: Failing test**

Create `src/shared/ui/progress-bar.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./progress-bar";

describe("ProgressBar", () => {
  it("expõe o valor via aria e largura", () => {
    render(<ProgressBar value={49} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "49");
  });
  it("limita o valor entre 0 e 100", () => {
    render(<ProgressBar value={250} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `pnpm test:run src/shared/ui/progress-bar.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

Create `src/shared/ui/progress-bar.tsx`:
```tsx
import { cn } from "@/shared/lib/cn";

interface ProgressBarProps {
  value: number;
  className?: string;
  label?: string;
}

export function ProgressBar({ value, className, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-surface-container", className)}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-secondary-fixed-dim to-primary-container transition-all duration-700"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
```

Add to `src/shared/ui/index.ts`: `export { ProgressBar } from "./progress-bar";`

- [ ] **Step 4: Run — expect PASS**

Run: `pnpm test:run src/shared/ui/progress-bar.test.tsx && pnpm type-check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui/progress-bar.tsx src/shared/ui/progress-bar.test.tsx src/shared/ui/index.ts
git commit -m "add reusable progress bar primitive"
```

---

## Task 3: Login "Entrar" → autentica → `/painel`

**Files:**
- Modify: `src/widgets/landing/nav.tsx`
- Test (e2e): `e2e/auth/entrar-painel.spec.ts` + `e2e/auth/evidencias/`

**Interfaces:**
- Consumes: `useAuth().signInWithGoogle()` (async), `next/navigation` `useRouter`.

- [ ] **Step 1: Modify Nav to redirect after login**

In `src/widgets/landing/nav.tsx`:
- Import `useRouter` from `next/navigation`.
- Create `const router = useRouter();`
- Replace both `onClick={signInWithGoogle}` handlers with:
```tsx
onClick={async () => {
  await signInWithGoogle();
  router.push("/painel");
}}
```
Apply to the desktop "Entrar" button and the mobile menu button.

- [ ] **Step 2: Write e2e test**

Create `e2e/auth/entrar-painel.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("clicar em Entrar leva ao painel logado", async ({ page }, testInfo) => {
  await page.goto("/");
  const entrar = page.getByRole("button", { name: "Entrar" }).first();
  await entrar.click();
  await page.waitForURL("**/painel");
  await expect(page.getByText(/Olá,/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Meus Presentes" })).toBeVisible();
  await page.screenshot({
    path: `e2e/auth/evidencias/entrar-painel-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
```

- [ ] **Step 3: Run e2e**

Run: `pnpm test:e2e e2e/auth/entrar-painel.spec.ts`
Expected: PASS em mobile-chrome e desktop-chrome; PNGs gerados em `e2e/auth/evidencias/`.

- [ ] **Step 4: type-check + lint**

Run: `pnpm type-check && pnpm lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/landing/nav.tsx e2e/auth/entrar-painel.spec.ts e2e/auth/evidencias
git commit -m "redirect to dashboard after login from landing"
```

---

## Task 4: Painel — card "Meta de Presentes"

**Files:**
- Create: `src/widgets/painel/meta-card.tsx`, `src/widgets/painel/meta-card.test.tsx`
- Modify: `src/app/painel/page.tsx`

Visual de referência: bloco "Meta de Presentes" em `code.html` (linhas ~173–183).

**Interfaces:**
- Consumes: `ProgressBar` (Task 2), `percentualMeta` + `MetaEvento` (Task 1), `formatPreco` (`@/entities/presente`).
- Produces: `MetaCard({ meta }: { meta: MetaEvento })`.

- [ ] **Step 1: Failing test**

Create `src/widgets/painel/meta-card.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetaCard } from "./meta-card";

describe("MetaCard", () => {
  it("mostra o percentual e os valores da meta", () => {
    render(<MetaCard meta={{ alvo: 5000, atingido: 2450 }} />);
    expect(screen.getByText("Meta de Presentes")).toBeVisible();
    expect(screen.getByText(/49%/)).toBeVisible();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "49");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `pnpm test:run src/widgets/painel/meta-card.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement MetaCard**

Create `src/widgets/painel/meta-card.tsx` (traduzir o markup do Stitch usando tokens):
```tsx
import { Card, ProgressBar } from "@/shared/ui";
import { percentualMeta, type MetaEvento } from "@/entities/evento";
import { formatPreco } from "@/entities/presente";

interface MetaCardProps {
  meta: MetaEvento;
}

export function MetaCard({ meta }: MetaCardProps) {
  const pct = percentualMeta(meta);
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-on-surface">Meta de Presentes</h2>
        <span className="text-sm font-bold text-primary">
          {formatPreco(meta.atingido)} / {formatPreco(meta.alvo)}
        </span>
      </div>
      <ProgressBar value={pct} label="Progresso da meta de presentes" className="mb-4 h-4" />
      <p className="text-on-surface-variant">
        Você já atingiu {pct}% da meta total para a sua festa!
      </p>
    </Card>
  );
}
```

- [ ] **Step 4: Wire into painel page**

In `src/app/painel/page.tsx`:
- Import: `import { MetaCard } from "@/widgets/painel/meta-card";`
- In the `md:col-span-2` slot (currently `<ResumoCard .../>`), render the meta when present, else keep `ResumoCard`:
```tsx
<div className="md:col-span-2">
  {evento.meta ? (
    <MetaCard meta={evento.meta} />
  ) : (
    <ResumoCard total={presentes.length} reservados={reservados} disponiveis={disponiveis} />
  )}
</div>
```

- [ ] **Step 5: Run tests + type-check**

Run: `pnpm test:run src/widgets/painel && pnpm type-check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/widgets/painel/meta-card.tsx src/widgets/painel/meta-card.test.tsx src/app/painel/page.tsx
git commit -m "add gift goal card to host dashboard"
```

---

## Task 5: host-gift-card — "% Arrecadado" e rodapé fiel ao Stitch

**Files:**
- Modify: `src/features/gerenciar-presentes/host-gift-card.tsx`
- Test: `src/features/gerenciar-presentes/host-gift-card.test.tsx` (criar se não existir)

Visual de referência: cards de "Meus Presentes" em `code.html` (linhas ~213–293) — imagem com badge, título, preço, rodapé com (ícone link + origem) à esquerda e editar/excluir à direita; em grupo, rodapé mostra "{pct}% Arrecadado".

**Interfaces:**
- Consumes: `percentualGrupo` + `MetaGrupo` (Task 1), `Presente`.
- Mantém a assinatura atual de props (`presente`, `onEdit`, `onDelete`). **Primeiro leia o arquivo atual** para preservar props e estilos.

- [ ] **Step 1: Failing test (group gift shows arrecadado)**

Create/extend `src/features/gerenciar-presentes/host-gift-card.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HostGiftCard } from "./host-gift-card";
import type { Presente } from "@/entities/presente";

const base: Presente = {
  id: "p4", eventoId: "e1", nome: "Cafeteira", descricao: "",
  imagemUrl: "", precoReferencia: 1500, linkLoja: "", maisDesejado: false,
  emGrupo: true, status: "disponivel", metaGrupo: { alvo: 1500, arrecadado: 600 },
};

describe("HostGiftCard — presente em grupo", () => {
  it("mostra o percentual arrecadado", () => {
    render(<HostGiftCard presente={base} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/40% Arrecadado/)).toBeVisible();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `pnpm test:run src/features/gerenciar-presentes/host-gift-card.test.tsx`
Expected: FAIL (texto ausente).

- [ ] **Step 3: Implement**

Read `src/features/gerenciar-presentes/host-gift-card.tsx`, then in the footer/meta row render the arrecadado when group + metaGrupo present:
```tsx
{presente.emGrupo && presente.metaGrupo ? (
  <span className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
    {percentualGrupo(presente.metaGrupo)}% Arrecadado
  </span>
) : (
  /* origem existente: ícone link + "Link Externo" / domínio */
)}
```
Garanta badges "Mais Desejado" (tertiary) e "Presente em Grupo" (secondary) conforme Stitch. Importe `percentualGrupo` de `@/entities/presente`.

- [ ] **Step 4: Run tests + type-check**

Run: `pnpm test:run src/features/gerenciar-presentes && pnpm type-check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/gerenciar-presentes/host-gift-card.tsx src/features/gerenciar-presentes/host-gift-card.test.tsx
git commit -m "show collected percentage on host group gift cards"
```

---

## Task 6: Lista do convidado — bento, grupo (progresso + Contribuir), confetti, balões

**Files:**
- Modify: `src/features/lista-convidado/gift-card.tsx`
- Modify: `src/features/lista-convidado/lista-convidado-screen.tsx`
- Modify: `src/widgets/host-header/host-header.tsx`
- Test: `src/features/lista-convidado/gift-card.test.tsx` (estender)

Visual de referência: `tela1.html` — hero com avatar circular + selo 🎂 (linhas ~182–201), filtros (203–217), bento grid com 1º card destaque (220–242), card de grupo com barra de progresso + botão "Contribuir" (284–315), balões de fundo (158–163) e confetti no clique.

**Interfaces:**
- Consumes: `percentualGrupo`/`MetaGrupo` (Task 1), `ProgressBar` (Task 2), `ConfettiBurst` (`@/shared/ui`), `Presente`.
- `GiftCard` mantém props atuais (`presente`, `onPresentear`). **Leia o arquivo atual primeiro.**

- [ ] **Step 1: Failing test — grupo mostra progresso + "Contribuir"**

Estender `src/features/lista-convidado/gift-card.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GiftCard } from "./gift-card";
import type { Presente } from "@/entities/presente";

const grupo: Presente = {
  id: "p4", eventoId: "e1", nome: "Cafeteira", descricao: "Meta nova casa",
  imagemUrl: "", precoReferencia: 1500, linkLoja: "", maisDesejado: false,
  emGrupo: true, status: "disponivel", metaGrupo: { alvo: 1500, arrecadado: 600 },
};

describe("GiftCard — presente em grupo", () => {
  it("mostra barra de progresso e botão Contribuir", () => {
    render(<GiftCard presente={grupo} onPresentear={vi.fn()} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByRole("button", { name: /Contribuir/ })).toBeVisible();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `pnpm test:run src/features/lista-convidado/gift-card.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement gift-card**

Read the current `gift-card.tsx`, then:
- Quando `emGrupo && metaGrupo`: render `ProgressBar value={percentualGrupo(metaGrupo)}` + linha "R$ {arrecadado} arrecadados / R$ {alvo}" e botão **"Contribuir"** (variante secondary, ícone `PlusCircle`).
- Caso contrário: botão **"Presentear"** (primary, ícone `Gift`).
- Ambos chamam `onPresentear()`.
- Badges: "Mais Desejado"/`NOVO` conforme flags.
- Confetti: ao clicar, dispara `ConfettiBurst` local (estado `useState`) antes/junto de `onPresentear()`.

- [ ] **Step 4: Bento grid + balões**

In `lista-convidado-screen.tsx`:
- Add background balloons (4 divs absolutos com `bg-confetti-*`, `pointer-events-none`, `-z-10`) — traduzir de `tela1.html` (158–163); animação via classe utilitária ou `style` inline com keyframe já existente/novo em `globals.css` (`float-up`). Se precisar do keyframe, adicione em `globals.css`.
- Grid bento: o card com `maisDesejado` ocupa `lg:col-span-2` (destaque). Pode passar uma prop `destaque` ao `GiftCard` ou aplicar `className` no wrapper do grid.

In `host-header.tsx` (read first): hero centralizado com avatar circular (borda primary) + selo 🎂 (badge amarelo `confetti-yellow`/`tertiary`), título (`titulo`), mensagem e botão RSVP. Manter props atuais.

- [ ] **Step 5: Run tests + type-check + lint**

Run: `pnpm test:run src/features/lista-convidado && pnpm type-check && pnpm lint`
Expected: PASS.

- [ ] **Step 6: e2e — lista do convidado**

Create `e2e/lista/lista-convidado.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("lista do convidado mostra hero, filtros e presentes", async ({ page }, testInfo) => {
  await page.goto("/l/festa-rodrigo-25");
  await expect(page.getByRole("heading", { name: /Meus 25 Anos/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Presentear/ }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Contribuir/ })).toBeVisible();
  await page.screenshot({
    path: `e2e/lista/evidencias/lista-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
```
Run: `pnpm test:e2e e2e/lista/lista-convidado.spec.ts` → PASS + PNGs.

- [ ] **Step 7: Commit**

```bash
git add src/features/lista-convidado src/widgets/host-header e2e/lista src/app/globals.css
git commit -m "redesign guest gift list with bento layout and group gifts"
```

---

## Task 7: Checkout — pagamento decorativo + "Presente Reservado!"

**Files:**
- Modify: `src/features/reservar-presente/finalizar-presente-screen.tsx`
- Modify: `src/features/reservar-presente/reserva-form.tsx`
- Modify: `src/features/reservar-presente/success-overlay.tsx`
- Test: `src/features/reservar-presente/success-overlay` coverage via e2e + unit do botão.

Visual de referência: `tela2.html` — resumo (152–182), selo "Transação 100% Segura" (174–181), bloco "Escolha como pagar" PIX/Cartão **desabilitado** (184–243), subtotal/total (244–257), overlay de sucesso (262–272).

- [ ] **Step 1: Failing test — overlay diz "Presente Reservado!"**

Create `src/features/reservar-presente/success-overlay.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SuccessOverlay } from "./success-overlay";

describe("SuccessOverlay", () => {
  it("comunica reserva (sem pagamento)", () => {
    render(<SuccessOverlay onVoltar={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Presente Reservado!" })).toBeVisible();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `pnpm test:run src/features/reservar-presente/success-overlay.test.tsx`
Expected: FAIL (atual diz "Presente Enviado!").

- [ ] **Step 3: Update success-overlay copy**

In `success-overlay.tsx`, change heading to `Presente Reservado!` and message to algo como:
`Sua reserva foi confirmada! O presente é combinado diretamente com o aniversariante.`

- [ ] **Step 4: Reserva form button copy**

In `reserva-form.tsx` (read first), set the submit button label to **"Confirmar Reserva"** (com ícone `PartyPopper`/`Gift`). Mantém a lógica de reserva idempotente atual.

- [ ] **Step 5: Decorative payment block + totals**

In `finalizar-presente-screen.tsx`, dentro da coluna direita (acima/junto do `ReservaForm`), adicionar markup traduzido do Stitch:
- Selo "Transação 100% Segura" (ícone `ShieldCheck`).
- Card "Escolha como pagar" com opções PIX/Cartão e campos de cartão **todos `disabled`** + nota PT-BR: "Pagamento indisponível — o presente é combinado fora do app."
- Subtotal/Total = `formatPreco(presente.precoReferencia)` (read-only).
Esses elementos são puramente visuais; **não** coletam nem enviam dados de pagamento.

- [ ] **Step 6: Run unit + type-check + lint**

Run: `pnpm test:run src/features/reservar-presente && pnpm type-check && pnpm lint`
Expected: PASS.

- [ ] **Step 7: e2e — reserva ponta a ponta**

Update/confirm `e2e/reserva/reservar-presente.spec.ts` cobre: abrir checkout, preencher nome/mensagem, clicar "Confirmar Reserva", ver "Presente Reservado!", screenshot em `e2e/reserva/evidencias/`.
Run: `pnpm test:e2e e2e/reserva` → PASS + PNGs.

- [ ] **Step 8: Commit**

```bash
git add src/features/reservar-presente e2e/reserva
git commit -m "redesign gift checkout as reservation with decorative payment ui"
```

---

## Task 8: Quality gate final + atualizar design/

**Files:**
- Modify (se necessário): `design/` (PNGs/notas) para refletir o Stitch.

- [ ] **Step 1: Suite completa**

Run: `pnpm type-check && pnpm lint && pnpm test:run`
Expected: tudo verde.

- [ ] **Step 2: e2e completo**

Run: `pnpm test:e2e`
Expected: todos os specs verdes; PNGs de evidência presentes em `e2e/**/evidencias/`.

- [ ] **Step 3: Revisão visual (375 / 768 / 1280)**

Conferir as 3 telas nos breakpoints mobile-first; comparar com os PNGs do Stitch.

- [ ] **Step 4: Atualizar design/ se divergir**

Substituir/atualizar `design/03-painel-aniversariante.png`, `design/04-lista-presentes-convidado.png`, `design/05-finalizar-presente.png` com a referência Stitch quando aplicável (ou anotar em `design/00-design-system.md` que o Stitch é a nova referência).

- [ ] **Step 5: Commit**

```bash
git add design
git commit -m "sync design references with stitch redesign"
```

---

## Self-Review (autor)

- **Spec coverage:** Login→painel (T3) ✓ · Painel/Meta+convidados+grid (T1,T4,T5) ✓ · Lista convidado/hero+bento+grupo+confetti (T1,T2,T6) ✓ · Checkout decorativo+reserva (T1,T7) ✓ · dados read-only (T1) ✓ · testes 3 camadas (cada task) ✓ · design/ (T8) ✓.
- **Placeholders:** nenhum passo deixa lógica "a implementar" sem código ou referência concreta ao HTML Stitch + tokens.
- **Type consistency:** `percentualMeta`/`MetaEvento`, `percentualGrupo`/`MetaGrupo`, `ProgressBar`, `MetaCard` usados com as mesmas assinaturas em todas as tasks.
