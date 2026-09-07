# AI-IP-Scan

Nuxt 4 implementation of the supplied Figma design.

## Run locally

```bash
pnpm install
pnpm dev
```

Then open the URL printed by Nuxt.

## Blog storage on Vercel

The blog admin uses Vercel Blob when `BLOB_READ_WRITE_TOKEN` or `BLOB_STORE_ID`
is available. Connect a private Blob store to the Vercel project so published
posts and drafts persist between serverless deployments. Local development falls
back to the JSON files in `server/data/posts`.
