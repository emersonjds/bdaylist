---
name: Vibrant Celebration
colors:
  surface: "#f4fafd"
  surface-dim: "#d4dbdd"
  surface-bright: "#f4fafd"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#eef5f7"
  surface-container: "#e8eff1"
  surface-container-high: "#e2e9ec"
  surface-container-highest: "#dde4e6"
  on-surface: "#161d1f"
  on-surface-variant: "#594042"
  inverse-surface: "#2b3234"
  inverse-on-surface: "#ebf2f4"
  outline: "#8d7071"
  outline-variant: "#e1bebf"
  surface-tint: "#b5213e"
  primary: "#b5213e"
  on-primary: "#ffffff"
  primary-container: "#ff5a70"
  on-primary-container: "#610019"
  inverse-primary: "#ffb2b7"
  secondary: "#006874"
  on-secondary: "#ffffff"
  secondary-container: "#5ce9fe"
  on-secondary-container: "#006773"
  tertiary: "#735c00"
  on-tertiary: "#ffffff"
  tertiary-container: "#cda721"
  on-tertiary-container: "#4e3d00"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#ffdadb"
  primary-fixed-dim: "#ffb2b7"
  on-primary-fixed: "#40000d"
  on-primary-fixed-variant: "#92002a"
  secondary-fixed: "#98f0ff"
  secondary-fixed-dim: "#45d8ed"
  on-secondary-fixed: "#001f24"
  on-secondary-fixed-variant: "#004f58"
  tertiary-fixed: "#ffe087"
  tertiary-fixed-dim: "#ebc23e"
  on-tertiary-fixed: "#241a00"
  on-tertiary-fixed-variant: "#574500"
  background: "#f4fafd"
  on-background: "#161d1f"
  surface-variant: "#dde4e6"
  surface-soft: "#FFF9FB"
  confetti-pink: "#FF85A2"
  confetti-blue: "#76E4F7"
  confetti-yellow: "#FFE082"
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: "800"
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: "700"
    lineHeight: 36px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 32px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-bold:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: "700"
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  section-padding-desktop: 80px
  section-padding-mobile: 40px
  gutter: 24px
  container-max-width: 1200px
---

> **Referência visual atual (atualizado em 2026-06-20):** Os renders do Stitch substituem as versões anteriores como fonte de verdade visual para três telas:
> - `03-painel-aniversariante.png` — painel do aniversariante (contagem regressiva, meta, grid de presentes, convidados).
> - `04-lista-presentes-convidado.png` — lista do convidado (hero, bento de stats, filtros, grid de presentes, grupo).
> - `05-finalizar-presente.png` — tela de finalizar/checkout do convidado.
>
> **Importante:** a UI de pagamento exibida no Stitch (campo de valor, "Contribuir") é decorativa — o fluxo atual é apenas **reserva**, sem dinheiro passando pelo app. Não implementar processamento de pagamento sem decisão explícita do produto.

## Brand & Style

This design system is built to evoke the infectious joy of a birthday celebration. It transforms the structured reliability of a registry platform into a high-energy, festive experience. The aesthetic is a fusion of **Modern Corporate** structure and **High-Contrast/Bold** playfulness, ensuring the platform remains functional for gift management while feeling like a party.

The visual narrative is defined by:

- **Exuberance:** Utilizing a warm, saturated primary palette that feels inviting and energetic.
- **Clarity:** Maintaining a clean, organized layout inspired by professional gift registries to ensure ease of use for both hosts and guests.
- **Celebratory Accents:** Using subtle patterns (confetti-inspired micro-dots) and vibrant gradients to lift the mood of functional elements.

## Colors

The palette is anchored by **Vibrant Coral (#FF5A70)**, which provides a modern, warm alternative to traditional birthday pinks. This is balanced by **Turquoise (#26C6DA)** for secondary actions and **Festive Yellow (#FFD54F)** for highlights and accents.

- **Primary:** Used for main CTAs, brand marks, and active states.
- **Secondary:** Used for supportive actions, badges, and progress indicators.
- **Tertiary:** Used sparingly for "wow" moments, celebratory icons, and rating stars.
- **Neutral:** A deep charcoal is used for text to ensure high legibility against the white and soft-pink surfaces.
- **Surface:** A very faint pink-white (`#FFF9FB`) is used for section backgrounds to keep the vibe warm without sacrificing whitespace.

## Typography

This design system uses **Montserrat** exclusively to achieve a modern, geometric, and friendly tone. The typeface's high x-height and open counters make it exceptionally legible for gift descriptions and price points.

- **Headlines:** Use ExtraBold (800) or Bold (700) weights with slightly tight letter spacing for a punchy, impactful "editorial" look.
- **Body:** Uses Regular (400) weight for maximum readability.
- **Labels:** Use Bold (700) with increased letter spacing and all-caps for "eyebrow" text and small UI labels to create a professional contrast.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile. The layout philosophy emphasizes "Breathing Room" to prevent the vibrant colors from feeling overwhelming.

- **Vertical Rhythm:** A base-8 spacing system is used. Sections are separated by large 80px gaps on desktop to clearly delineate features like "Gift List," "RSVP," and "Wall of Messages."
- **Margins:** 24px margins on mobile to ensure content doesn't touch the screen edges.
- **Gift Grid:** Presents are displayed in a responsive grid (3 or 4 columns on desktop, 1 or 2 on mobile) with 24px gutters.

## Elevation & Depth

Visual hierarchy is established through a mix of **Tonal Layers** and **Ambient Shadows**.

- **Surfaces:** Main content lives on white cards (`#FFFFFF`) placed over the `surface-soft` background.
- **Shadows:** Use extremely soft, diffused shadows with a slight tint of the primary color. For example: `0px 10px 30px rgba(255, 90, 112, 0.08)`. This makes the cards feel like they are floating slightly above the page, mimicking the lightness of balloons.
- **Interactions:** Upon hover, cards should lift slightly (translate -4px) and the shadow should become slightly more pronounced.

## Shapes

The shape language is consistently **Rounded**. Sharp corners are avoided to maintain the friendly, approachable brand personality.

- **Buttons & Chips:** Use a full pill-shape (radius: 100px) for a "bubbly" and tactile feel.
- **Cards:** Utilize a 16px (`rounded-lg`) corner radius.
- **Input Fields:** Utilize an 8px (`rounded-md`) corner radius to maintain a sense of structure within forms.

## Components

### Buttons

Primary buttons are pill-shaped with a solid **Coral** fill and white text. Secondary buttons use a ghost style with a 2px Coral border. Apply a subtle scale-up effect (1.05x) on hover to mimic a "pop" sensation.

### Gift Cards

Cards feature a large, top-aligned image with a 12px corner radius. Below the image, the title is in `headline-md` and the price in a bold primary color. A "Contribute" button should always be visible or appear on hover.

### Input Fields

Inputs use a thick 2px border in a light grey, which turns **Turquoise** on focus. The labels are always visible above the field in `label-bold`.

### Celebration Elements (Unique)

- **Micro-interactions:** When a gift is purchased or a goal is reached, a brief confetti burst animation should occur.
- **Progress Bars:** Used for "Group Gifts," these use a Turquoise-to-Coral gradient fill to indicate progress toward the total amount.
- **Badges:** Small, rounded badges (e.g., "Most Wanted," "New") use the **Yellow** tertiary color with dark text for high visibility.

### Lists & Navigation

Navigation items use `label-bold`. The active state is indicated by a 4px Coral dot centered underneath the text, rather than a standard underline.
