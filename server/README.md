# Clarity Key Legal – API Server

## Setup

1. Install deps

```bash
cd server
npm i
```

2. Configure environment

- Create a service account in Google Cloud with access to Storage (and Document AI if used)
- Set one of:
  - `GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/service-account.json`
  - `GOOGLE_APPLICATION_CREDENTIALS_JSON=...` (inline JSON)
- Set `GCS_BUCKET=your-bucket-name`

3. Run locally

```bash
# from repo root
npm run server:dev
```

API runs on `http://localhost:8787`. Vite dev server proxies `/api` to it.

## Auth

Send Firebase ID token in `Authorization: Bearer <token>` header. The token is obtained on the client after Google sign-in.





