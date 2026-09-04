# XM Cloud Starter Kits - AI Coding Agent Instructions

## Repository Architecture

This is a **multi-starter monorepo** for Sitecore XM Cloud headless applications. Each starter in `/examples/` is an independent Next.js or SPA application with its own deployment lifecycle, but all share common patterns and conventions.

**Key Directories:**
- `/examples/` - Standalone front-end starter applications (Next.js App Router & SPA)
- `/authoring/` - Sitecore content items, templates, and C# deployment artifacts
- `/local-containers/` - Docker-based local Sitecore development environment (Windows only)
- `xmcloud.build.json` - XM Cloud deployment manifest (rendering hosts configuration)

**Active Starters:**
- `kit-nextjs-article-starter` - Editorial/lifestyle template (Solterra & Co.)
- `kit-nextjs-location-finder` - Automotive with location finder (Alaris)
- `kit-nextjs-product-listing` - Product showcase template (SYNC)
- `kit-nextjs-skate-park` - Component demo site
- `basic-nextjs` - Minimal Next.js starter
- `basic-spa` - Angular SPA with Node proxy
- `lighthouse` - Lighthouse Lifestyle demo site (migrated from Sitecore-Lighthouse-2026)
- `round-rock-sasquatch` - Second Lighthouse project site (migrated from Sitecore-Lighthouse-2026)

## Critical Development Workflows

### Local Development Setup
Each starter is developed independently. Navigate to the starter directory first:

```bash
cd examples/kit-nextjs-article-starter

# Copy environment template
cp .env.remote.example .env.local

# Edit .env.local with required values:
# - SITECORE_EDGE_CONTEXT_ID
# - NEXT_PUBLIC_DEFAULT_SITE_NAME  
# - NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID
# - SITECORE_EDITING_SECRET

# Install and run
npm install
npm run dev  # Development server at localhost:3000
```

### Build Commands (Next.js Starters)
All Next.js starters use a **multi-step build pipeline**:

```bash
npm run dev    # Development: generate component map → sitecore tools build → next dev
npm run build  # Production: sitecore-tools:generate-map → sitecore-tools:build → next build
npm run start  # Production server (runs build first, then next start)
```

**Critical:** Never run `next build` directly. Always use `npm run build` which includes Sitecore tooling steps:
1. `sitecore-tools:generate-map` - Generates component mapping from Sitecore
2. `sitecore-tools:build` - Builds Sitecore configuration
3. `next:build` - Builds Next.js application

### Local Sitecore Container Development
**Windows-only** Docker setup for disconnected development:

```powershell
# Initialize repository (run once, requires elevated privileges)
./local-containers/scripts/init.ps1 -InitEnv -LicenseXmlPath "C:\path\to\license.xml" -AdminPassword "DesiredAdminPassword"

# Start containers
./local-containers/scripts/up.ps1

# Stop containers and cleanup
./local-containers/scripts/down.ps1
```

## Sitecore XM Cloud Integration Patterns

### Component Architecture (Locality of Behavior)
All Sitecore components follow this structure:

```typescript
// File: src/components/hero/Hero.tsx
import { ComponentProps } from '@/lib/component-props';
import { Text, Image, useSitecore } from '@sitecore-content-sdk/nextjs';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

interface HeroFields {
  title?: { jsonValue: Field<string> };
  subtitle?: { jsonValue: Field<string> };
  backgroundImage?: { jsonValue: ImageField };
}

interface HeroProps extends ComponentProps {
  fields: {
    data: {
      datasource: HeroFields;
    };
  };
  isPageEditing?: boolean;
}

// Export named variants (Default required, others optional)
export const Default: React.FC<HeroProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <HeroDefault {...props} isPageEditing={isEditing} />;
};

export const ImageBottom: React.FC<HeroProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <HeroImageBottom {...props} isPageEditing={isEditing} />;
};

// Implementation components
const HeroDefault: React.FC<HeroProps> = ({ fields, isPageEditing }) => {
  // CRITICAL: Always validate datasource existence
  if (!fields?.data?.datasource) {
    return <NoDataFallback componentName="Hero" />;
  }

  // Safe destructuring with fallbacks
  const { title, subtitle, backgroundImage } = fields.data.datasource;

  return (
    <section className="hero">
      {/* Render fields even when empty in editing mode */}
      {(title?.jsonValue?.value || isPageEditing) && (
        <Text field={title?.jsonValue} tag="h1" />
      )}
      {(subtitle?.jsonValue?.value || isPageEditing) && (
        <Text field={subtitle?.jsonValue} tag="p" />
      )}
      {(backgroundImage?.jsonValue?.value?.src || isPageEditing) && (
        <Image field={backgroundImage?.jsonValue} />
      )}
    </section>
  );
};
```

**Key Patterns:**
- Always extend `ComponentProps` from `@/lib/component-props`
- Access fields via `fields.data.datasource` structure
- Export named variants: `Default`, `ThreeUp`, `Slider`, `ImageBottom`, etc.
- Check `isPageEditing` to show empty fields in authoring mode
- Use `NoDataFallback` component when datasource is missing
- Always use Sitecore field components (`Text`, `RichText`, `Image`) - never render raw values

### Environment Variables (Required)
Every starter needs these in `.env.local`:

```bash
SITECORE_EDGE_CONTEXT_ID=your-context-id-here
NEXT_PUBLIC_DEFAULT_SITE_NAME=your-site-name
NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID=your-context-id-here
SITECORE_EDITING_SECRET=your-editing-secret
```

Get values from XM Cloud Portal → Environment → Site Settings → Developer Settings.

## TypeScript & Code Style

**Strict TypeScript:**
- Strict mode enabled in all projects
- Never use `any` - use explicit types or `unknown` with type guards
- Export types at module boundaries for reusability
- Define proper interfaces for all Sitecore data structures

**Naming Conventions:**
- Components/Classes: `PascalCase` (e.g., `HeroWithContent`, `ProductListing`)
- Variables/Functions: `camelCase` (e.g., `getUserData`, `isLoading`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_ENDPOINT`, `DEFAULT_TIMEOUT`)
- Directories: `kebab-case` (e.g., `src/components`, `api-clients`)

**React Patterns:**
- Functional components with hooks only
- Server Components by default (Next.js App Router)
- Client Components (`'use client'`) only for interactivity
- Use React.memo sparingly for expensive components

## XM Cloud Deployment

**Deployment Architecture:**
The repository is deployed to XM Cloud/Sitecore AI with a multi-environment architecture:
- **PS-Shared Authoring Environment** - Shared Sitecore content management environment
- **Editing Hosts** - Individual Next.js rendering hosts deployed per starter application
- Each enabled starter in `xmcloud.build.json` gets its own editing host deployment
- Editing hosts connect back to the shared authoring environment for content

**Editing Hosts Configuration:**
Deployment is controlled by `xmcloud.build.json`:

```json
{
  "renderingHosts": {
    "kit-nextjs-article-starter": {
      "path": "./examples/kit-nextjs-article-starter",
      "nodeVersion": "22.22.0",
      "enabled": true,
      "type": "sxa",
      "buildCommand": "build",
      "runCommand": "next:start"
    }
  }
}
```

- Only starters with `"enabled": true` are deployed as editing hosts
- `buildCommand` must be `"build"` (not `"next:build"`)
- `runCommand` must be `"next:start"` for Next.js starters
- Each editing host runs independently but shares the authoring environment

### Vercel Deployment

**Working Directory for Vercel CLI:**
All Vercel CLI commands must be run from the individual starter directory, not the repository root:

```bash
# Navigate to the starter directory FIRST
cd C:\Repo\xmcloud-starter-js\examples\kit-nextjs-article-starter

# Then run Vercel commands
vercel --prod          # Deploy to production
vercel ls              # List deployments
vercel logs <url>      # View logs for a deployment
```

**Common Vercel Commands:**
```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# List recent deployments
vercel ls

# View logs (requires deployment URL)
vercel logs https://article-starter-xyz.vercel.app

# View logs in JSON format for filtering
vercel logs <deployment-url> --format=json

# View environment variables
vercel env ls
```

**Important:** Running Vercel commands from the wrong directory will fail. Always `cd` to the specific starter directory first.

## Development Constraints

**Multi-Starter Independence:**
- Each starter maintains its own `package.json` and dependencies
- No monorepo linking or shared packages between starters
- Shared patterns are **copied**, not shared via imports
- Each starter can be developed and deployed independently

**DMZ Git Workflow (Planned):**
- Feature branches from `main`, PRs to `dmz` branch
- `dmz` acts as integration/staging branch
- `main` is always clean and deployable
- PRs merged to `dmz` after review, then to `main` periodically

**File Safety:**
- Never edit compiled artifacts in `/dist`, `/build`, `.next`
- Never edit generated files in `.sitecore/`
- Never commit `.env.local` or secrets

## Testing Strategy

**Recommended Testing Stack:**
- Jest or Vitest for unit testing
- React Testing Library for component testing
- MSW (Mock Service Worker) for API mocking
- Playwright or Cypress for E2E testing

**Sitecore Component Testing:**
```typescript
// Always test with missing fields scenario
it('handles missing datasource gracefully', () => {
  render(<Hero fields={{}} />);
  expect(screen.getByText(/content not configured/i)).toBeInTheDocument();
});

// Test editing mode behavior
it('shows empty fields in editing mode', () => {
  render(<Hero fields={emptyFields} isPageEditing={true} />);
  expect(screen.getByRole('heading')).toBeInTheDocument(); // Field shown even when empty
});
```

## Development Tools

**Sitecore MCP Integration:**
- MCP (Model Context Protocol) server connected at `https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod`
- Configured in `.vscode/mcp.json` as `sitecore-marketer`
- Provides AI agents with direct access to Sitecore XM Cloud operations
- Use for querying Sitecore content, pages, components, and site structure

**Sitecore CLI for Content Serialization:**
- CLI configuration is in `/authoring/sitecore.json`
- Module files are in `/authoring/items/*.module.json`
- Serialized items are stored in `/authoring/items/items/templates/items/`

```powershell
# Navigate to authoring folder first
cd authoring

# Initialize CLI (first time only)
dotnet sitecore init

# Install XM Cloud plugin (first time only)
dotnet sitecore plugin add -n Sitecore.DevEx.Extensibility.XMCloud

# Login to Sitecore Cloud
dotnet sitecore cloud login

# List projects
dotnet sitecore cloud project list

# List environments for ps-shared project
dotnet sitecore cloud environment list --project-id Uhoyk4uSHBdm0Fn2Da2aY

# Connect to ps-shared-dev environment with write access
dotnet sitecore cloud environment connect --environment-id 35yxRJsnSIqo3WAkXGkKp5 --allow-write

# Check serialization configuration
dotnet sitecore ser info

# Pull items from XM Cloud to local
dotnet sitecore ser pull

# Push items from local to XM Cloud
dotnet sitecore ser push

# Validate serialization (dry run)
dotnet sitecore ser validate
```

**XM Cloud Environment IDs (ps-shared project):**
- Project ID: `Uhoyk4uSHBdm0Fn2Da2aY`
- ps-shared-dev (CM): `35yxRJsnSIqo3WAkXGkKp5` - `xmc-professionaad47-psshared23db-psshareddevad68.sitecorecloud.io`
- ps-shared-qa (CM): `3naHuQOe0onKH2lE4N374z`
- kit-nextjs-article-starter (EH): `5Ryb2qdWEc8OOohKAPhL5r`
- kit-nextjs-location-starter (EH): `55Rm61ljRcR6fe2tVR59nY`
- kit-nextjs-product-starter (EH): `wfSShGvbv6WWYpNclzjIe`
- nextjsstarter (EH): `27j6H8GdZVTINQrBke25RE`

**Serialization Module Configuration:**
The `ccl.module.json` deploys all shared templates. Key properties:
- `items.path`: Relative path from module to .yml files (e.g., `"items/templates/items"`)
- `includes[].name`: Folder name where items are stored
- `includes[].path`: Sitecore path to serialize
- `includes[].scope`: `itemAndDescendants`, `singleItem`, `itemAndChildren`
- `includes[].allowedPushOperations`: `CreateUpdateAndDelete`, `CreateAndUpdate`, `CreateOnly`

## Additional Context

**Tailwind + Shadcn/ui:**
- All starters use Tailwind CSS with `@container` queries
- Shadcn/ui components for accessibility and consistency
- Framer Motion for animations
- Lucide React for icons

**Localization:**
- All starters support `en` and `en-CA` locales
- Use `next-intl` for internationalization
- Dictionary files in `src/i18n/` or `src/dictionaries/`

**Sitecore Content SDK:**
- Modern SDK replacing legacy `@sitecore-jss/sitecore-jss-nextjs` (still used for field types)
- Use `@sitecore-content-sdk/nextjs` for all new components
- SDK handles editing host integration and content fetching

## Reference Files

**Essential Configuration:**
- [xmcloud.build.json](xmcloud.build.json) - Deployment manifest
- [.cursor/rules/](\.cursor\rules) - Detailed AI coding guidelines (Cursor-specific)
- Each starter's `sitecore.config.ts` - Sitecore SDK configuration
- Each starter's `next.config.ts` - Next.js configuration

**Key Source Directories:**
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Sitecore components (organized by type)
- `src/lib/` - Utilities, helpers, and SDK configuration
- `src/types/` - TypeScript type definitions
