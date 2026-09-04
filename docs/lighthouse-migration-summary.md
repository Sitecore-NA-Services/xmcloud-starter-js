# Lighthouse & Round Rock Sasquatch Migration — Session Summary

**Date:** 2026-09-02
**Repos involved:**
- Source: `Sitecore-Lighthouse-2026-SitecoreAI`
- Target: `xmcloud-starter-js` (multi-starter monorepo, shared `ps-shared` XM Cloud environment)

## Goal

Migrate the two-site Lighthouse project (`lighthouse` and `round-rock-sasquatch`) into the `xmcloud-starter-js` monorepo, get their content live in the shared `ps-shared-dev` CM environment, and deploy both front ends to Vercel production pulling from that instance.

---

## 1. Planning

Reviewed both repos' structure before touching anything:

- Source has two Next.js apps (`examples/lighthouse`, `examples/round-rock-sasquatch`) and 4+ serialization modules (`lighthouse`, `lighthouse-global`, `lighthouse-spe`, `round-rock-sasquatch`) plus a separate on-demand `content/` snapshot mechanism.
- Target already hosts 6 other starters sharing one CM environment (`ps-shared-dev`) via a common `ccl` (click-click-launch) template module.
- Diffed all Sitecore item paths between source and target — confirmed no path/ID overlap up front (later found two real overlaps anyway; see below).

Confirmed with the user: plain file copy (no git history), keep folder names as-is, deploy into the existing shared `ps-shared` environment, and bring over the content-snapshot tooling too.

## 2. File migration

- Copied `examples/lighthouse` and `examples/round-rock-sasquatch` into the target (excluding `node_modules`, `.next`, `.sitecore`, `.env.local`).
- Copied the 4 serialization modules and their item folders into `authoring/items/`.
- Copied `content/`, `content-push/sitecore.json`, and root `sitecore.content.json` (the full-content-snapshot tooling).
- Registered both apps as rendering hosts in `xmcloud.build.json`.
- Updated `.github/copilot-instructions.md` to list the new starters.

### Real GUID collision found during merge

Both `lighthouse` and the pre-existing `ccl` module had independently created a **"Partial Design Folder"** template + its `__Standard Values` under their own project path, but reused the *same hardcoded GUID* (an SXA "Add Site" wizard quirk). `dotnet sitecore ser validate` caught this. Fixed by regenerating new GUIDs for lighthouse's copy only and propagating the change across every file that referenced it (template, standard values, a content item's `Template` field, and a PowerShell script's hardcoded ID string), leaving the shared `ccl` template (used by 3 other starters) untouched.

**Lesson:** always run `ser validate` after merging modules from separate Sitecore projects, even when template paths look disjoint on paper.

## 3. Environment variables

Compared to the existing `kit-nextjs-article-starter` starter to figure out which `.env.local` values are shared vs. per-site:

- **Shared** (environment-level, same for every rendering host in `ps-shared-dev`): `SITECORE_EDGE_CONTEXT_ID`, `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`, `SITECORE_EDITING_SECRET`.
- **Per-site**: `NEXT_PUBLIC_DEFAULT_SITE_NAME` (`lighthouse-lifestyle` / `round-rock-sasquatch`, pulled from each app's `sitecore.config.ts` fallback), `NEXT_PUBLIC_SITEMAP_HOST` (filled in once each site had a real deployed URL).

Created `.env.local` for both apps locally, then later mirrored the same values into Vercel's production environment variables.

## 4. Pushing content to the shared CM environment

Authenticated the Sitecore CLI (`dotnet sitecore cloud login`, device-code flow), connected to `ps-shared-dev` with write access, and pushed the 4 template/rendering modules — dry-run first (`-w`), confirmed additions-only, then pushed for real and verified with a follow-up dry-run showing 0 pending changes.

Published master → web → Edge. Discovered the target's `authoring/sitecore.json` had no Publishing plugin installed (`dotnet sitecore publish` — "unrecognized command"); fixed by installing `Sitecore.DevEx.Extensibility.Publishing` pinned to version `6.0.23` to match the installed CLI version (the default/latest `7.0.24` silently failed to register the `publish` command due to a version mismatch).

## 5. Creating editing hosts & first Vercel deploy attempt

Per the user's prompt ("we need to configure their editing hosts as well"), created two new XM Cloud editing host environments via CLI (`dotnet sitecore cloud editinghost create`) and triggered deployments by directly uploading the local repo directory (`--upload -dir <repo>`), since the repo isn't linked to Cloud Portal git integration.

First Vercel deploy attempt for `lighthouse` hit a chain of real, sequential blockers:

### a. Corporate TLS-inspection proxy blocking Vercel CLI entirely

`vercel whoami` / `vercel login` failed with `self-signed certificate in certificate chain`. This was **not** a Vercel CLI version problem — `dotnet sitecore` calls worked fine because .NET trusts the Windows certificate store, but Node.js does not read that store by default (only `NODE_EXTRA_CA_CERTS`).

Diagnosed by opening a raw `SslStream` connection to `vercel.com` and printing the actual certificate chain presented (bypassing validation), which revealed the leaf cert was issued by `CN=Sitecore_Trust_Certificate` — a corporate MITM proxy cert, not a real Vercel cert. Traced the trust chain to a Group-Policy-deployed root (`CN=Sitecore Class 1 Root Certificate Authority, O=Sitecore, C=DK`, visible only via `certutil -store -grouppolicy Root`, not the normal `Cert:\LocalMachine\Root`). Exported it, converted to PEM, and appended it to the same file already referenced by `NODE_EXTRA_CA_CERTS`. Fixed — no CLI update needed.

### b. Missing `.sitecore` build artifacts

First `vercel --prod` build failed with `ENOENT .sitecore/component-map.ts`. That folder had been deliberately excluded during the initial file copy (assumed to be local-only cache) but is actually partially checked into git and required at build time. Copied it over from the source repo (excluding the `.cache` subfolder).

### c. Missing Vercel environment variables

Next build failed with a Content SDK configuration error (no Edge context ID). Added all 5 required env vars per project via `vercel env add <NAME> production`, run interactively in an async terminal pre-navigated to the project directory (the tool silently strips a `cd X; command` one-liner for async terminals, so `cd` and the interactive command had to be sent as separate steps).

### d. Missing site content tree

Next build failed with `Site "lighthouse-lifestyle" does not exist or site item tree is missing`. The original module push only included templates/renderings — the actual site pages live in a separate set of modules (`lighthouse-content`, `lighthouse-global-content`, `RoundRockSasquatch.Content`) defined under `content/*.module.json`, referencing item folders that were already physically copied but never included in `authoring/sitecore.json`'s module glob. Fixed by adding `"../content/*.module.json"` to that glob (simpler than wiring up the separate `content-push/` CLI project + `.sitecore` junction described in the source repo's README).

### e. Real remote data conflicts during the content push

- **Global item ID collision:** `/sitecore/system/Languages/ja-JP` already existed in `ps-shared-dev` under a different GUID (created earlier by a different starter). Resolved by removing lighthouse's own `ll.languages` module include entirely — the required languages already exist globally, so lighthouse doesn't need to manage that shared tree.
- **Circular cross-module dependency:** the tenant content root item (owned by `lighthouse-content`) needs the `Headless Tenant` *template* (owned by `lighthouse-global`) to exist first, but `lighthouse-global`'s own content subtree needs that same tenant root as its *parent*. `ser push` validates and aborts the entire batch on any unresolved reference — it doesn't automatically resolve cross-module dependency ordering. Fixed by temporarily removing the dependent content block from `lighthouse-global.module.json`, pushing templates only, restoring the block, pushing `lighthouse-content` (creates the root), then pushing `lighthouse-global` again.
- A handful of cosmetic `INCORRECT FILE PATH` validation warnings (differing max-path-length config between source and target) were left as-is and pushed with `-s` (skip validation) since they don't affect data correctness.

Published everything to Edge again after these fixes.

## 6. Successful deployment

With content live and env vars set, both apps built and deployed successfully:

- **Lighthouse:** https://lighthouse-gamma-ashen.vercel.app
- **Round Rock Sasquatch:** https://round-rock-sasquatch.vercel.app

Verified both by fetching the live homepages — real Sitecore-driven content, images served from the `ps-shared-dev` media library, and working internal links. Set `NEXT_PUBLIC_SITEMAP_HOST` on both Vercel projects to their real assigned URLs once known.

---

## Outstanding / not done

- Vercel domains are the auto-assigned ones (`lighthouse-gamma-ashen.vercel.app`, `round-rock-sasquatch.vercel.app`) — no custom domain configured.
- No CI/CD wiring between this repo and Vercel (deploys were manual `vercel --prod`).
- The cosmetic file-path-length validation warnings in `ser validate` were left unfixed (harmless).
