# PresenceOS Dashboard

Vite + React + TypeScript dashboard app.

## Deploying to Vercel

This repository is configured for static deployment on Vercel.

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`
- SPA rewrites are configured so client-side routes resolve to `index.html`
- Cache headers are configured for hashed assets under `/assets/*`

### One-time setup

1. Import this repository into Vercel.
2. Keep framework preset as **Vite** (or **Other** with the same build/output values above).
3. Add any required environment variables in the Vercel project settings.

### Local verification

```bash
npm ci
npm run build
npm run preview
```
