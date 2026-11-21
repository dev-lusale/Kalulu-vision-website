# Kalulu Vision — design reference

This records the design system used by the website, and what was (and was not) taken from the CPHIA reference site.

## 1. CPHIA reference audit (cphia.africacdc.org)

**How it was studied.** The rendered page content of https://cphia.africacdc.org/ was read on 21 November 2026. Browser inspection of computed CSS was not available in the build environment, so **no CPHIA colour values, font names or CSS measurements are claimed here**. Everything below is structural and was observed directly.

**Verified observations (structure and information hierarchy):**

| Area | What CPHIA does | How Kalulu Vision adapts it |
|---|---|---|
| Header | Logo, primary navigation with dropdowns (About, Programme, Open Calls, Exhibitions, Side Events, Media, Resources), language switcher, Sign in / Register | Utility bar (slogan, email, phone, Tech Lessons) + white header with dropdowns (About Us, Services mega-menu, Products), theme switcher, "Contact Us" action |
| Mobile | "Open main menu" toggle | Full-height drawer with expandable groups, focus trap, Escape to close, theme switcher |
| Hero | Event title, dates, venue, attendee figure, two buttons ("Register Now", "Learn More") | Headline, description, two buttons, and a small facts strip using **real counts from the database** (services, projects, live products) — no invented statistics |
| Audience selector | "I want to Attend / Sponsor / Speak / I am Media / Partner" | "How can we help you?" pathways: solution, partner, learn, join, research |
| Numbered feature cards | "What to Expect" cards numbered 01–06 | Six technology capabilities numbered 01–06 |
| Tabbed programme | Tabs (Tracks, Sessions, Speakers, By Day) | Accessible category tabs on featured projects |
| Calls with status | Participation cards marked Apply Open / Closed | Opportunities show "Applications open" / "Closed"; projects and products show their real development stage |
| Partner section | "Partner with us", tiered partner logos | Partnership types + enquiry form. **No partner logos are shown** because none are verified |
| Stay updated | Email subscription | "Stay updated" sign-up in the footer, stored in the admin inbox |
| Footer | Multi-column links, legal (Privacy, Terms, Cookie, Refund), copyright | Company / Services / Our work / Contact columns, Privacy Policy, Terms of Use, copyright |

**Design principles carried over:** bright institutional backgrounds, alternating white and soft-grey sections, strong dark headings, clear section titles with a short accent rule, consistent card system, generous spacing, and photography given real space.

**Not copied:** CPHIA branding, logo, imagery, wording, or the conference structure.

## 2. Brand

- **Logo:** the original orange 3D hare (`public/brand/kalulu-vision-logo-original.png`), used unchanged in the header, footer, About page, favicon and the subtle 3D hero element. Derivatives in `public/brand/` are resized copies only.
- **Logo orange (sampled from the PNG):** dominant ≈ `#F88A12`. Used selectively as a brand accent (partner buttons, stay-updated button, small highlights), never as a large background.
- **Slogan:** SEE BEYOND. BUILD THE FUTURE.

## 3. Colour tokens

Defined once in `app/globals.css` as CSS variables and switched with `<html data-theme>`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#212121` | Page |
| `soft` | `#F5F7FA` | `#171717` | Alternate sections |
| `soft-2` | `#EDF2F7` | `#2A2A2A` | Placeholders, chips |
| `surface` | `#FFFFFF` | `#303030` | Cards |
| `elevated` | `#FFFFFF` | `#383838` | Menus, dialogs |
| `fg` | `#172B45` | `#FFFFFF` | Primary text |
| `muted` | `#596579` | `#B4B4B4` | Secondary text |
| `line` | `#E2E8F0` | `#454545` | Borders |
| `primary` | `#174A78` | `#FFFFFF` | Primary buttons, links |
| `on-primary` | `#FFFFFF` | `#171717` | Text on primary |
| `accent` | `#159A9A` | `#4FC1C1` | Icons, rules, focus ring |
| `accent-ink` | `#0D7272` | `#7FD6D6` | Teal text |
| `brand` | `#F88A12` | `#F88A12` | Logo orange accents |
| `brand-ink` | `#B0500A` | `#FFA54D` | Orange text |
| `band` | `#0F2A47` | `#171717` | Navy bands: utility bar, CTA, footer |

### Contrast (WCAG 2.1)

| Pair | Colours | Ratio |
|---|---|---|
| Primary text on white | `#172B45` / `#FFFFFF` | 14.3:1 |
| Secondary text on white | `#596579` / `#FFFFFF` | 5.9:1 |
| Secondary text on light grey | `#596579` / `#F5F7FA` | 5.5:1 |
| White on primary action | `#FFFFFF` / `#174A78` | 9.2:1 |
| Teal text on white | `#0D7272` / `#FFFFFF` | 5.7:1 |
| Teal accent (icons and rules only) | `#159A9A` / `#FFFFFF` | 3.4:1 |
| Orange text on white | `#B0500A` / `#FFFFFF` | 5.3:1 |
| Dark text on orange button | `#171717` / `#F88A12` | 7.4:1 |
| White on navy band | `#FFFFFF` / `#0F2A47` | 14.6:1 |
| Dark: primary text | `#FFFFFF` / `#212121` | 16.1:1 |
| Dark: secondary text | `#B4B4B4` / `#212121` | 7.8:1 |
| Dark: secondary text on card | `#B4B4B4` / `#303030` | 6.4:1 |
| Dark: primary button | `#171717` / `#FFFFFF` | 17.9:1 |

The raw logo orange (`#F88A12`) is 2.4:1 on white, so it is never used for text on light backgrounds; `brand-ink` is used instead.

## 4. Typography

- Headings: **Space Grotesk** (bold, tight tracking). Body: **DM Sans**, 16px base, 1.65 line height. Both are self-hosted (`app/fonts/`).
- Eyebrows: 0.8rem, uppercase, 0.14em tracking, teal.

## 5. Themes

- Light is the default. Choices: Light / Dark / System, saved in `localStorage` (`kv-theme`) and applied before first paint, so there is no flash.
- Dark mode follows a ChatGPT-style neutral palette: grey surfaces, white primary buttons with dark text, no pure black and no neon.
- The admin CMS, the Tech Lessons pages and the enrolment dashboard all follow the theme.

## 6. Components and motion

- Cards: 14px radius, 1px border, soft shadow; linked cards lift 3px on hover.
- Section title rule: 56×4px, teal into orange.
- Motion: reveal-on-scroll (fade and 18px rise), gentle photo parallax, and a subtle three.js logo turn. All of these are disabled under `prefers-reduced-motion`. The 3D logo falls back to a layered static image without WebGL, on low-memory devices, or with Data Saver on.

## 7. Photography policy

- Photos are authentic images of Kalulu Vision's founder and of events he took part in, with factual captions. They are not presented as an office, staff team, clients or partners.
- Project and product images are real interface screenshots. Where none exist yet, a labelled placeholder ("Screenshots to be published") is shown instead of a mock-up.
- Every photo slot can be replaced in **Admin → Company info → Website photos**, and alt text is required.
