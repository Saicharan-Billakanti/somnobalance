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

This project deploys to **Cloudflare Workers** only, with **Supabase** as the database/auth backend. No Vercel or other hosting platform is used.

```bash
npm run build:vinext      # builds the Workers-compatible output via vinext
npm run deploy:vinext     # deploys to the "somnobalance" Cloudflare Worker
```

Production is served from `somnobalance.com` / `www.somnobalance.com`, both routed to the `somnobalance` Worker. See `wrangler.jsonc` for the Worker configuration.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
