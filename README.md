# SyncReach API (Express + MongoDB + Cloudinary)

Standalone backend — deploy this repo alone on **Render**.

## Setup

```bash
npm install
cp .env.example .env   # fill MongoDB, JWT, Cloudinary
npm run seed
npm run dev            # http://localhost:5000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with watch |
| `npm start` | Production |
| `npm run seed` | Create demo admin + sample data |

Demo: `admin@syncreach.com` / `admin123`

## Render

- **Root Directory:** `.` (this whole repo)
- **Build:** `npm install`
- **Start:** `npm start`
- **Health:** `/api/health`

Env (required for CORS with live sites):

| Key | Value |
|-----|--------|
| `CLIENT_URL` | `https://sync-reach-public-site.vercel.app` |
| `PORTAL_URL` | `https://sync-reach-portal-two.vercel.app` |
| `CORS_ORIGINS` | `http://localhost:8080,http://localhost:8081` (optional) |
| + | `MONGODB_URI`, `JWT_SECRET`, Cloudinary keys, `HOST=0.0.0.0` |
