# Tablekeeper launch guide

Tablekeeper is a React + Vite frontend with an Express + TypeScript server.

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm dev
```

Open `http://localhost:3000`.

## Build and run production

```bash
pnpm install --frozen-lockfile
pnpm build
PORT=3000 pnpm start
```

The readiness endpoint is `GET /api/health`.

## Docker

```bash
docker build -t tablekeeper .
docker run --rm -p 3000:3000 tablekeeper
```

The app is configured to listen on `PORT` and defaults to `3000`.

## Update and deploy

1. Edit the source files under `client/` and `server/`.
2. Run `pnpm check && pnpm test && pnpm build`.
3. Commit and push to `main`.
4. Deploy the repository using the included `Dockerfile`; use `/api/health` as the health check.

The rotating Nigerian restaurant and dish imagery uses managed storage URLs in `client/src/pages/Home.tsx`, so keep those URLs intact when moving the app to another host.
