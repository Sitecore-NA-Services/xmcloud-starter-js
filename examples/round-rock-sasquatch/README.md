# Round Rock Sasquatch Society — Next.js Rendering Host

The Next.js (App Router) rendering host for the **Round Rock Sasquatch Society** site
(`round-rock-sasquatch`), integrated with Sitecore XM Cloud / SitecoreAI via the Content SDK.

It is a migration of the standalone Next.js site at https://round-rock-sasquatch.vercel.app/
(source repo: `RRSS`) into an SXA Headless site. The original pages are re-expressed as placeable
Content SDK renderings that keep their behaviour:

| Rendering | What it renders |
|---|---|
| `Header` / `Footer` | Site chrome (header has the live cookie cart count); placed via `headless-header` / `headless-footer` |
| `Hero` | The forest hero band. Title/subtitle come from rendering params (`heroTitle`, `heroSubtitle`); defaults to the Home copy |
| `ArticleList` | The Home page "Latest Field Reports" block (cards from `src/data/articles.ts`) |
| `ArticleDetail` | A field-report article page — looks up the article by the route item name |
| `AboutBody` | The About page body copy |
| `FootprintDivider` | Standalone footprint divider graphic |
| `ProductGrid` | The Shop catalogue (products from `content/products/*.md`) |
| `ProductDetail` | A product page (add-to-cart form) — looks up the product by the route item name |
| `Cart` / `Checkout` / `CheckoutSuccess` | The cookie-backed cart, the (satirical) checkout form, and the order-confirmation page |

Article bodies and product copy live in the app's data layer (`src/data/`, `content/products/`), not in
Sitecore items, so the Sitecore footprint stays small. The SVG illustrations and mini-markdown renderer
are ported verbatim into `src/ui/`. The cookie cart logic and server actions are in `src/lib/cart.ts` and
`src/app/actions/cart.ts`.

## Run locally

1. The local XM Cloud CM must be up (`../../local-containers/scripts/up.ps1`) and must contain the
   `round-rock-sasquatch` SXA Headless site (created under `/sitecore/content/round-rock-sasquatch-sites`).
2. `.env.local` is already configured for the local CM (it points at `https://xmcloudcm.localhost` with the
   shared API key and sets `NEXT_PUBLIC_DEFAULT_SITE_NAME=round-rock-sasquatch`). For a remote XM Cloud
   environment, copy `.env.remote.example` → `.env.local` and fill in the Edge context id instead.
3. Install and run on a port that doesn't clash with the `lighthouse` host (which uses 3000):

   ```bash
   cd examples/round-rock-sasquatch
   npm install
   PORT=3001 npm run dev
   ```

4. Open **http://localhost:3001**.

## Deploying to XM Cloud

This app is registered as the `round-rock-sasquatch` rendering host in the repo's `xmcloud.build.json`
(`type: sxa`, `path: ./examples/round-rock-sasquatch`). When the repo is connected to an XM Cloud
environment, the deploy builds this app alongside `lighthouse`. The site's serialized items live under
`authoring/items/round-rock-sasquatch` (see the repo root README).

## Docs

- [Sitecore Content SDK for XM Cloud](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html)
