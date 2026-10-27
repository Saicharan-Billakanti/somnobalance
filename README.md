This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Deployment

The configured deployment target is **Cloudflare Workers** via vinext. Storage is currently mixed: D1 for core records, contact messages and newsletter request evidence; Supabase for partner/business services and parts of authentication. See [backend handoff](docs/backend-handoff.md) for setup and verification status.

```bash
npm run deploy:vinext     # builds fresh (predeploy) and deploys to the "somnobalance" Cloudflare Worker
```

The Worker name is `somnobalance`. The current deployment is available at https://somnobalance.mounipullepu42.workers.dev. Custom-domain routing is not configured in `wrangler.jsonc`; verify it in Cloudflare before attaching a domain. Removing repository Vercel configuration does not disconnect an external Vercel project.

For Worker-compatible local development use `npm run dev:vinext`. Copy `.env.example` to the ignored `.dev.vars` and configure values securely. Do not run live provider submissions without approval. Automated `npm test` uses mocked external services only.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
