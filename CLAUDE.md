# Palisade — Project Overview

E-commerce platforma bazirana na Payload CMS + Next.js 16 + PostgreSQL.

## Struktura projekta

```
palisade/
├── backend/        ← Payload CMS (CMS + API + Admin panel)
├── frontend/       ← Next.js frontend (u izradi)
├── nginx/
│   └── conf.d/default.conf
├── docker-compose.yml
└── .env.example
```

## Pokretanje lokalno

```bash
# Backend (na :3001)
cd backend
cp .env.example .env   # popuni DATABASE_URL, PAYLOAD_SECRET
pnpm install
pnpm payload migrate:fresh   # svježa baza
pnpm dev

# Frontend (na :3000) — kad bude spreman
cd frontend
pnpm install
pnpm dev
```

## Docker (produkcija)

```bash
cp .env.example .env   # popuni sve varijable
docker compose up -d
```

## Portovi

| Servis   | Lokalno | Docker interno |
|----------|---------|----------------|
| Backend  | :3001   | backend:3000   |
| Frontend | :3000   | frontend:3000  |
| Postgres | :5433   | postgres:5432  |
| Nginx    | —       | :80            |

> Postgres koristi port **5433** lokalno da ne konfliktuje sa drugim projektima.

## Jezik

- Default locale: **srpski (`sr`)**
- Sekundarni: engleski (`en`)
- Sva lokalizovana polja imaju `localized: true`
- Cijene, slugovi, kodovi kupona — NISU lokalizovani

## .env varijable (root nivo za Docker)

Vidi `.env.example`. Ključne:
- `DATABASE_URL_BUILD` — koristi se tokom Docker builda (host:5433)
- `DATABASE_URL` — koristi se tokom runtime (postgres:5432 unutar Dockera)
- `PAYLOAD_PUBLIC_SERVER_URL` — javni URL backenda
- `NEXT_PUBLIC_SERVER_URL` — javni URL frontenda
