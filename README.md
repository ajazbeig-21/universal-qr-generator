# universal-qr-generator

Universal QR Generator is a small utility that creates a single QR code which redirects mobile users to the appropriate app store (App Store or Google Play) depending on device type.

This repository contains two primary pieces:

- `universal-qr-angular/` — the Angular frontend application (UI to enter iOS/Android store links and preview/download QR images).
- `backend/` — a minimal Express backend that generates QR images and exposes a redirect endpoint. The backend stores generated mapping files under `backend/qrcodes/`.

## 🧩 Architecture Overview

- Frontend: Angular (client) — UI and build artifacts served by NGINX in production image.
- Backend: Express (Node) — handles `/api/generate` to create QR assets and `/redirect/:id` (or `/api/r/:id`) to route mobile users to the correct app store.
- Deployment: Docker Compose is included and runs NGINX (serving the frontend) with a proxied backend service.

Stack summary

- Angular 20+ (frontend)
- Express (Node.js) backend
- qrcode npm package for QR generation
- NGINX (production static serving + API proxy)
- Docker & Docker Compose for containerized deployment

## Quickstart — local development

1) Frontend (dev server):

```bash
cd universal-qr-angular
npm install
ng serve     # or: ng serve
```

Open http://localhost:4200.

The frontend dev server expects the backend to be available at http://localhost:3000 when running locally (this is the dev default used by the Angular app). Run the backend below.

2) Backend (local):

```bash
cd backend
npm install
node server.js    # starts on port 5000 by default (see backend/Dockerfile and server.js)
```

By default the backend exposes:
- POST /api/generate — accepts JSON { iosLink, androidLink } and returns { id, qrUrl, redirectUrl }
- GET /redirect/:id or GET /api/r/:id — redirects to the correct store based on user-agent

Note: Some dev setups in this repo used port 3000 for the backend; the `backend/server.js` in this repo listens on port 5000 by default. Update the frontend API URL in `universal-qr-angular/src/app/qr-generator/qr-generator.ts` if you run the backend on a different port.

## Docker (production) — one-command

The repository includes a Dockerfile and an NGINX config to serve the built Angular app and proxy `/api/` requests to the backend service defined in Compose.

Start the full stack with Docker Compose:

```bash
# from repository root
docker compose up --build
```

Compose will build the frontend, the backend service, and start NGINX to serve the static files. The NGINX proxy routes API calls to the backend service defined in `docker-compose.yml`.

Open http://localhost:8080 (or check `docker-compose.yml` for configured port).

## File layout (important files)

- `universal-qr-angular/` — Angular app and build artifacts
	- `src/` — application source
	- `Dockerfile` — multi-stage build to build the Angular app
	- `nginx.conf` — nginx configuration used by the production image
- `backend/` — Express backend
	- `server.js` — runtime JS server (CommonJS/ESM depending on file)
	- `server.ts` — TypeScript source (optional)
	- `qrcodes/` — generated QR images and metadata

## Production notes

- The production image uses NGINX to serve static files and proxy `/api/` to the backend. This keeps frontend and backend in separate containers and allows scaling the backend independently.
- The backend persists QR data under `backend/qrcodes/` by writing JSON and PNG files. For production you may want to replace this with a database or persistent volume.

## Troubleshooting

- If the frontend shows no QR/redirect link after generation, confirm the backend returned a `qrUrl` or `redirectUrl` key. The frontend accepts both `qrImage` (data URL) and `qrUrl` (static PNG URL); it will also accept an `id` and build a redirect link.
- If Docker Compose fails to connect to the Docker daemon, ensure Docker Engine is running locally.

## Contribution

Contributions welcome — open an issue or PR. Small suggestions I can add on request:
- Add a `docker-compose.override.yml` for development convenience.
- Add a persistent Docker volume for `backend/qrcodes/`.
- Convert the TypeScript backend to compile in the build stage instead of shipping a compiled JS file.

## License

See the `LICENSE` file in this repository.
