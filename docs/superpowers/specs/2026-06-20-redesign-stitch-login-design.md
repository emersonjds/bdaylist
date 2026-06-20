# Spec — Redesign Stitch (3 telas) + fluxo de login

**Data:** 2026-06-20
**Status:** Aprovado para planejamento

## Contexto

Três novas telas geradas no Stitch passam a ser a **fonte de verdade visual** do BdayList,
substituindo o visual das telas já existentes. A arquitetura Feature-Sliced Design, o backend
mock (MSW) e a estratégia de testes em 3 camadas (unit + MSW + Playwright) são mantidos.

Telas de referência (Stitch):

| Stitch | Tela do produto | Rota existente |
|--------|-----------------|----------------|
| `screen.png` / `code.html` | Painel do Aniversariante | `/painel` |
| `tela1.png` / `tela1.html` | Lista do Convidado | `/l/[token]` |
| `tela2.png` / `tela2.html` | Checkout / Finalizar Presente | `/l/[token]/presentear/[giftId]` |

## Decisões (travadas com o usuário)

1. **Escopo de dinheiro — Visual fiel, sem pagar.** Campos de pagamento (PIX, cartão, CVV)
   são **decorativos/desabilitados**. Metas e "% arrecadado" são **exibição read-only**.
   O fluxo do convidado continua sendo **reserva** — não há processamento de pagamento.
   Honra o `CLAUDE.md` (§1 Escopo de dinheiro).
2. **Login — mock → `/painel`.** O botão "Entrar" autentica via o mock de auth atual e
   redireciona para `/painel` (a visão do dono logado). Sem Supabase. Mantém MSW.
3. **Redesign — Stitch é a nova verdade.** Atualizo as telas existentes para baterem com os
   PNGs do Stitch e atualizo `design/` onde necessário. Arquitetura FSD preservada.

## Requisitos por área

### A. Login → plataforma
- Botão "Entrar" (header da landing + qualquer CTA de login) chama o sign-in mock e
  redireciona para `/painel`.
- `/painel` permanece protegido por `RequireAuth`; pós-login o usuário vê o próprio dashboard.
- Sem Supabase, sem mudança de backend.

### B. Painel do Aniversariante (`/painel`)
- Hero "Olá, {nome}! 🎈" + badge coral "Faltam X dias" (reusa `evento/countdown`).
- Card **"Meta de Presentes"** (read-only): barra de progresso, "R$ atingido / R$ alvo" e "% atingido".
- Card "Convidados Confirmados": total + link "Ver lista completa".
- Grid "Meus Presentes": cards com badges **Mais Desejado** / **Presente em Grupo** /
  "% Arrecadado" (read-only), ações editar/excluir, tile tracejado "Adicionar Novo".
- Seção "Confirmados Recentemente": bubbles de convidados + indicador "+N".

### C. Lista do Convidado (`/l/[token]`)
- Hero centralizado: avatar com borda + selo 🎂, "Meus {idade} Anos!", mensagem, botão **RSVP**.
- Card de filtros: chips de preço (Todos / Até R$100 / R$100–300 / R$300+) + busca.
- **Bento grid**: 1º card (Mais Desejado) em destaque maior; demais com badge NOVO / Presente
  em Grupo (barra de progresso read-only).
- Botão "**Presentear**" (reserva). Em presente de grupo, "**Contribuir**" → checkout.
- Micro-interações: confetti no clique, balões flutuantes de fundo.
- "Ver mais presentes".

### D. Checkout / Finalizar (`/l/[token]/presentear/[giftId]`)
- Resumo do presente (imagem, nome, preço, tipo) + textarea "Mensagem Carinhosa".
- Selo "Transação 100% Segura".
- Bloco **"Escolha como pagar" decorativo/desabilitado** (PIX, Cartão, campos de cartão),
  com aviso sutil de que o presente é combinado fora do app.
- Subtotal/Total (read-only, do preço de referência).
- Botão "**Confirmar Reserva**" → overlay de sucesso "**Presente Reservado!**" com confetti.

## Modelo de dados (mock, read-only para dinheiro)

Adicionados apenas para **exibição** (sem lógica de pagamento):
- `Evento.meta?: { alvo: number; atingido: number }` — card Meta de Presentes.
- `Presente.metaGrupo?: { alvo: number; arrecadado: number }` — barra "% Arrecadado" de grupo.

Refletidos em: `src/mocks/db.ts`, entities (`evento`, `presente`), handlers MSW e schemas Zod.
Todos opcionais — telas degradam sem eles.

## Arquitetura

- Camadas FSD respeitadas (`app → widgets → features → entities → shared`).
- Reuso dos primitivos `shared/ui` (Button, Card, Badge, Input, Textarea, Dialog,
  ConfettiBurst). Novos primitivos só se ausentes (ex.: `ProgressBar`).
- Componentes de tela vivem em `widgets/` (composição) e `features/` (casos de uso).
- Sem dados reais de pagamento; campos de pagamento são markup desabilitado.

## Tokens / design

- Usar tokens existentes em `globals.css` (`primary`, `secondary`, `tertiary`, `confetti-*`,
  surfaces, tipografia Montserrat). Tokens do Stitch já correspondem ao design system.
- Atualizar PNGs em `design/` para refletir o Stitch quando divergirem.

## Testes (SDD, por feature)

Cada feature entrega as 3 camadas:
1. **Unit** — derivações/lógica pura (ex.: percentual da meta, idade a partir da data).
2. **MSW integration** — fetchers/queries contra os handlers mockados.
3. **E2E Playwright** — fluxo real no browser, com **PNG de evidência** em
   `e2e/<feature>/evidencias/*.png` (mobile 375 + desktop 1280).

Gate: `pnpm type-check` e lint sem erros; UI 100% PT-BR; responsivo (375/768/1280);
sem `console.log`/código morto; imports não usados removidos.

## Execução

- Orquestração com os agents do projeto: `pixel`/`front` (UI), `back` (mock/dados),
  `qa` (e2e), `bug` (quality gate), `scribe` (PT-BR).
- **Micro-commit atômico ao concluir cada feature** — mensagem em inglês, imperativo curto,
  **sem menção a IA/Claude/Anthropic** e sem rodapé `Co-Authored-By`.
- **Push final é do desenvolvedor humano** — nunca `git push` sem confirmação.

## Fora de escopo

- Processamento de pagamento real (PIX/gateway).
- Integração Supabase / auth real.
- Refatorações não relacionadas ao redesign.
