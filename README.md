# Branda V2 — Service Ordering

A responsive branding ecosystem built with Next.js App Router, React, TypeScript and Tailwind CSS. Twenty services connect **Digital, Gifts, Create, Studio and Prints** across Nigeria, the USA, the UK and Canada.

## Getting started

Use Node.js **22.12+** (Node 24 LTS is also suitable) and npm. The project preserves the supplied Next.js 16.4 / React 19.3 environment and its Tailwind 4 Turbopack integration.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root redirects to `/ng`. No API keys or database are required. If macOS reports permission errors, ensure this project belongs to your normal user; do not install dependencies with `sudo`.

Production builds use the standard `.next` directory expected by Next.js hosting integrations. Stop the development server before building locally.

For production:

```bash
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` to the public origin before building a deployment so canonical URLs, Open Graph links and the sitemap use the correct host.

## User journeys

- Explore all five categories, search with typo tolerance, combine use case / industry / turnaround filters, sort by price or popularity and paginate.
- Share any filtered URL, for example `/ng?category=Prints&urgency=3&sort=price-asc`. These results are rendered on the server and remain available without waiting for a browser data fetch.
- View a service gallery and enlarged preview, compare packages, change quantities, add to cart or go directly to checkout. Print quantities represent batches of the selected size.
- Change quantities and remove services in the cart. Checkout displays every line, estimated tax and the total before confirmation.
- Change the header market selector between `/ng`, `/us`, `/uk` and `/ca`. Local prices, currency and introductory copy change. Each market has its own saved bag.

## Architecture

```text
app/
  [market]/
    page.tsx                      Server-rendered catalogue
    services/[slug]/page.tsx       Statically generated service details
    cart/ checkout/ confirmation/  Ordering routes
    loading.tsx / error.tsx        Route loading and recovery states
  api/checkout/route.ts            Validated mock order endpoint
  sitemap.ts / robots.ts          Search discovery
components/
  layout/                         Header, market selector, footer
  ui/                             Typed buttons, quantity control
features/
  catalog/                        Model, mock data, queries, repository, UI
  cart/                           Scoped store, pricing, cart components
  checkout/                       Schemas, checkout and receipt UI
lib/                              Markets, currency formatting, class helpers
tests/                            Domain unit tests and browser journeys
public/images/                    Original local SVG brand mockups
```

Route files compose features; feature modules own their domain. Shared UI stays small. Pricing and query functions are pure and tested independently of React.

### Rendering and data flow

1. A catalogue Server Component awaits `params` and `searchParams` using this installed Next.js version's conventions.
2. Zod normalizes URL parameters. The asynchronous repository filters, searches, sorts and paginates typed mock data. It is the replacement point for a database, CMS or remote API; it intentionally avoids an unnecessary HTTP request to the app's own server.
3. Server-rendered cards are composed with small client components for filters, market selection, gallery controls and ordering. Detail pages are generated for the twenty services in all four markets. React `cache` deduplicates detail lookups within a render.
4. Cart state stores service identifiers, option identifiers and quantity. It does not persist copied prices. Amounts are calculated from the catalogue and active market.
5. Checkout POSTs validated details and item identifiers to `/api/checkout`. The server validates again and independently calculates prices. It returns a generated mock reference and an itemized receipt.

Server rendering handles catalogue data, so a client query cache such as React Query or SWR would add little value here. Native `fetch` is sufficient for the checkout mutation.

### State management

- **URL:** search, category, filters, sort and page. Reloads and shared links reconstruct the same result.
- **Zustand:** a store created inside the root provider, with one bag per market. There is no module-global mutable store shared between server requests. Explicit hydration avoids server/browser mismatches; malformed or obsolete persisted lines are discarded.
- **Local React state:** gallery selection, selected service package, quantity and form feedback.
- **Session storage:** the latest receipt per market in the current browser tab. Contact details are never persisted. A confirmation route with no receipt shows a useful empty state.

### Design and accessibility

The visual system uses cream, forest green, restrained serif headlines, a consistent spacing scale and original, locally stored SVG service mockups. No image host or remote font request is needed. Next Image reserves image dimensions; the main hero and detail image are prioritized and other service images load lazily.

Radix provides accessible modal focus management and Escape handling. Native form controls, associated labels, visible focus states, semantic landmarks, a skip link, live notifications and reduced-motion support are included. Layouts adapt from mobile through tablet to wide desktop.

### SEO

Each market and service has a title, description, canonical URL and Open Graph metadata. Dynamic PNG Open Graph images are generated with `next/og`. Service pages include locale alternatives. Filtered catalogue URLs have canonical URLs built from normalized parameters. The sitemap includes all market landing pages and service details. Cart, checkout and receipt routes are excluded from indexing.

## Packages and choices

| Package                      | Responsibility                               |
| ---------------------------- | -------------------------------------------- |
| Next.js / React / TypeScript | Routing, server rendering, typed composition |
| Tailwind CSS                 | Shared design tokens and responsive styling  |
| Radix UI                     | Accessible navigation and image dialogs      |
| Lucide React                 | Consistent SVG icons                         |
| Zustand                      | Small, explicitly hydrated persistent cart   |
| Zod                          | URL, cart, form and API boundary validation  |
| Fuse.js                      | Typo-tolerant catalogue search               |
| Sonner                       | Accessible action notifications              |
| CVA, clsx, tailwind-merge    | Typed UI variants and class composition      |
| Prettier + Tailwind plugin   | Code formatting and class ordering           |
| Vitest / Playwright          | Domain correctness and end-to-end journeys   |

## Verification

```bash
npm run check             # ESLint, route types, TypeScript, unit tests, formatting
npm run build             # Production compilation and static page generation
npx playwright install chromium
npm run test:e2e          # Starts production server on port 3100
```

Build before running browser tests. Playwright exercises desktop and mobile Chromium. Tests cover URL persistence, filtering, pagination, gallery interactions, market switching, local currencies, cart persistence and removal, validation, checkout and receipt refresh. The API test verifies that a supplied browser price cannot override server pricing. Unit tests cover search, filter normalization, pagination bounds, variations, integer arithmetic and invalid quantities.

Use `npm run format` after edits. Browser reports are generated in `playwright-report/` and ignored by Git.

## Demo boundaries and production follow-up

This is a complete frontend assessment flow with a mock backend, **not a payment or fulfilment integration**. It does not send emails, create durable orders, reserve stock or store customer details. Displayed tax rates are illustrative market defaults, not a production tax engine. Shipping is excluded and clearly disclosed. Prices are fixed local catalogue prices, not live foreign exchange conversions. The business-card starting price already includes its displayed discount.

A production rollout would replace the repository, calculate jurisdiction-specific tax and shipping, persist orders, add checkout idempotency and rate limiting, and integrate payments and fulfilment. Domain logic and API boundaries provide the insertion points. An account, authentication and multi-device cart synchronization are outside this assessment.
