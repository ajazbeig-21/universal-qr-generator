# universal-qr-generator

Universal QR Generator is a small, production-ready utility that generates a single QR code which redirects mobile users to the correct app store (App Store or Google Play) depending on their device. It's implemented as a single Angular application with an embedded Express backend for redirect logic and QR image generation, and is intended to be run locally, in Docker, or in simple hosting platforms.

## 🧩 Architecture Overview

High-level architecture:

- Frontend: Angular (client) — UI to provide iOS App Store URL and Google Play URL and to preview/download generated QR codes.
- Embedded backend: Express (Node.js) — lightweight API used for redirect logic and for generating QR PNG/SVG via the `qrcode` npm package.
- Shared: TypeScript across frontend and backend for consistent types and DX.
- Packaging / Deployment: Docker Compose provided to build and run the app container easily (single container serves both UI and redirect API).

Stack:

- Angular 17+ (frontend)
- Express (Node.js) for backend API and redirect logic
- TypeScript for both frontend and backend code
- qrcode npm package for generating QR images
- Docker & Docker Compose for containerized builds and run

## Quickstart

Prerequisites:

- Node.js (>= 18) and npm
- Docker & Docker Compose (for containerized run)

Local development (frontend dev server):

1. Install dependencies:

	cd frontend
	npm install

2. Start the dev server:

	npm start

3. Open your browser to http://localhost:4200

Note: The development server runs the Angular app only. The embedded Express server is wired for production builds / Docker.

Docker (build and run):

1. Build and run with Docker Compose (recommended):

	docker compose up --build

2. Open http://localhost:4200 (or the port configured in your Docker Compose or container)

If no `docker-compose.yml` is present, a simple Dockerfile-based build is still supported by creating a container that serves the Angular distribution with the embedded Express server.

## Redirect and QR behavior

- The app accepts two inputs: an iOS App Store URL and an Android Play Store URL.
- When a user scans the generated QR code, the request hits a lightweight redirect endpoint which detects the user-agent and forwards the user to the correct store URL.
- Optionally the API can return a PNG or SVG of the QR code for download or embedding.

## File layout (important files)

- `frontend/` — Angular app source
  - `src/` — Angular app entry and components
  - `package.json` — frontend scripts and dependencies
- `Dockerfile` (optional) — container build instructions
- `docker-compose.yml` (optional) — compose orchestration

## Development notes

- Use TypeScript types shared between client and server where possible to avoid duplication.
- The `qrcode` npm package is used server-side to produce PNG/SVG representations. Install it with `npm install qrcode` in the server context if needed.
- For production, enable appropriate security and rate limiting on redirect endpoints (see Express middlewares like `express-rate-limit`).

## Testing

- Frontend unit tests: `cd frontend && npm test`

## Contribution

Contributions are welcome. Please open an issue or a pull request with a clear description of the change.

## License

See the `LICENSE` file in this repository.

---

If you'd like, I can also:

- Add a `docker-compose.yml` and `Dockerfile` example.
- Add a small note with recommended environment variables for configuring redirect behavior.
- Generate a minimal Express redirect implementation and a small server README inside `frontend/`.

Tell me which of the extras you'd like and I'll add them next.
