# SoraBlog

SoraBlog is a personal blog system built with React, Vite, NestJS, MongoDB, Redis, Elasticsearch, and Docker Compose.

## Phase 1 Quickstart

### 1. Create environment variables

Copy the example file and replace the placeholder secret before starting Compose:

```bash
cp .env.example .env
```

Required values for local Compose:

- `JWT_SECRET`: use a long random value. Compose and production startup fail when this is missing or still looks like `change-me` / `replace-with`.
- `MONGODB_URI`: `mongodb://mongodb:27017/sorablog`
- `REDIS_URL`: `redis://redis:6379`
- `ELASTICSEARCH_NODE`: `http://elasticsearch:9200`
- `UPLOAD_DIR`: `/app/uploads` in Compose

### 2. Start the stack

```bash
docker compose up -d
docker compose ps
```

The frontend, backend, MongoDB, Redis, and Elasticsearch services all have healthchecks. The backend waits for MongoDB, Redis, and Elasticsearch to become healthy. The frontend waits for the backend healthcheck.

### 3. Seed the blogger account

Only the blogger/admin can log in and upload files in Phase 1. Normal visitors do not register or log in.

For a local backend process:

```bash
cd backend
export OWNER_EMAIL=owner@example.com
export OWNER_USERNAME=orangeMoon
export OWNER_PASSWORD="replace-with-a-real-password"
npm run --silent seed:owner
```

For the Compose backend container:

```bash
export OWNER_PASSWORD="replace-with-a-real-password"
docker compose exec \
  -e OWNER_EMAIL=owner@example.com \
  -e OWNER_USERNAME=orangeMoon \
  -e OWNER_PASSWORD="$OWNER_PASSWORD" \
  backend npm run --silent seed:owner
```

The seed command never prints the password or tokens. Password input must use `OWNER_PASSWORD`; `--password` is rejected because `npm run` can echo CLI arguments.

### 4. Verify health

```bash
curl http://localhost:3000/api/v1/health
curl http://localhost/api/v1/health
```

Healthy responses use the API envelope and include MongoDB, Redis, and Elasticsearch status keys.

### 5. Verify uploads

Uploaded files are stored under purpose folders and served from `/uploads`.

```bash
curl -I http://localhost/uploads/
```

The upload API is owner-only. Visitor image uploads are intentionally deferred until a later community/guestbook phase.

## Auth Model

Phase 1 intentionally has no public visitor registration or public visitor login. Visitors receive a backend-issued anonymous nickname such as `晴空123访客`. The blogger login page is hidden behind the frontend keyboard sequence `sorablog`.

## Troubleshooting

- If `docker compose config` fails with `JWT_SECRET` errors, set `JWT_SECRET` in `.env` or your shell before running Compose.
- If the backend remains unhealthy, inspect dependency status with `docker compose ps` and logs with `docker compose logs backend mongodb redis elasticsearch`.
- Elasticsearch can take longer to become healthy on first startup. The healthcheck start period and retries are tuned for local single-node validation, not production hardening.
- This Compose setup is for local/full-stack validation. Backups, multi-node Elasticsearch, advanced log retention, and production security hardening are out of Phase 1 scope.
