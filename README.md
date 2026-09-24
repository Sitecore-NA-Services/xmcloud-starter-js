# XM Cloud Front End Application Starter Kits — NA Services fork

> **This repository is used by the Sitecore North America Services team for testing.**
>
> It is a working fork, not a supported distribution. It **may not deploy cleanly to a fresh
> XM Cloud instance** — that has not been tested. Expect experimental changes, partially
> finished work, and environment-specific configuration.
>
> For a clean starting point, use the upstream repository instead:
> [Sitecore/xmcloud-starter-js](https://github.com/Sitecore/xmcloud-starter-js).

This repository contains multiple Next.js starter kits and the SPA starters monorepo for
Sitecore XM Cloud development. See [Deploying XM Cloud](https://doc.sitecore.com/xmc/en/developers/xm-cloud/deploying-xm-cloud.html).

## Layout

- **`/examples`** — the front-end applications, one per subfolder:
  - [basic-nextjs](examples/basic-nextjs/README.md)
  - [basic-nextjs-pages-router](examples/basic-nextjs-pages-router/README.md)
  - [basic-spa](examples/basic-spa/README.md)
  - [kit-nextjs-article-starter](examples/kit-nextjs-article-starter/README.md)
  - [kit-nextjs-location-finder](examples/kit-nextjs-location-finder/README.md)
  - [kit-nextjs-product-listing](examples/kit-nextjs-product-listing/README.md)
  - [kit-nextjs-skate-park](examples/kit-nextjs-skate-park/README.md)
  - [lighthouse](examples/lighthouse/README.md)
  - [round-rock-sasquatch](examples/round-rock-sasquatch/README.md)
- **`/authoring`** — Sitecore content items for deployment: templates, PowerShell and modules,
  each module defined by its own `.module.json`.
- **`/local-containers`** — Docker files for local development ([README](local-containers/README.md)).
- **`xmcloud.build.json`** — build and deployment configuration for rendering hosts. Its
  `renderingHosts` section defines each app to build, its path and its Node version.
