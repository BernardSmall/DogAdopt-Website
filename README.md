# DogAdopt

React recreation of the existing DogAdopt portfolio website, with an Express API and a persistent SQLite database. The original HTML, CSS, JavaScript, and `Photos/` assets remain in the repository as the reference. The React app reuses those styles and images, including the responsive improvements and Font Awesome 6 icons. No external account or database service is required.

## Requirements

- Node.js 24 or later and npm. SQLite uses Node's built-in `node:sqlite` module; some Node versions print an experimental warning.
- Run commands from the repository root.

## Install and run

```sh
npm install
cp .env.example .env
npm run dev
```

Open **http://127.0.0.1:5173**. Express listens on **http://127.0.0.1:3001**. The dev command starts both processes and stops both when interrupted.

To use separate terminals:

```sh
npm run dev:server
npm run dev:client
```

Vite proxies `/api` and `/Photos` to Express, so both processes must be running. Use the React development URL instead of opening the old `.html` files directly.

## Production build

```sh
npm run build
npm start
```

Open **http://127.0.0.1:3001**. Express serves `dist/`, the original `Photos/`, and the API. React routes support direct navigation and refresh. Deploy the server, `dist/`, `Photos/`, `server/dogs.json`, and installed runtime dependencies together. The images are intentionally not duplicated into the build.

For HTTPS deployment, set `NODE_ENV=production`, `COOKIE_SECURE=true`, and `ALLOWED_ORIGINS` to the public origin. The API always binds to `0.0.0.0` and ignores `HOST`. It uses the platform-provided `PORT`, falling back to `3001` locally. On Render, use `npm install && npm run build` as the build command and `npm start` as the start command. The start command executes `server/index.js`. Configure the reverse proxy and TLS for that environment. This is a portfolio application, with no email delivery, password recovery, or third-party OAuth integration.

## Configuration

See `.env.example`. Configuration includes API port, Vite port, API proxy target, SQLite path, allowed submission origins, secure cookies, and session lifetime. `.env` and runtime databases are ignored by Git. Vite reads configuration at startup; restart after changing it. Do not put secrets in variables prefixed `VITE_`, which are public browser configuration.

## Pages and preserved behavior

| React route | Original URL |
| --- | --- |
| `/` | `/HomePage.html` |
| `/about` | `/AboutUs.html` |
| `/dogs` | `/dogs.html` |
| `/adopt` | `/adopt.html` |
| `/contact` | `/Contact.html` |
| `/login` | `/login.html` |
| `/signup` | `/SignUp.html` |
| `/loading` | `/Loading.html` |

Old URLs redirect inside React, preserving query strings. Both `/adopt?dogId=buddy` and the original `/adopt.html?dog=Buddy` select Buddy. Adoption without a selected dog records general adoption interest, matching the original standalone form. Invalid dog selections cannot be submitted.

The home page preserves Penny, bo'oh o' wah'ah, Maximus, and Inca as featured dogs. The Dogs page displays every listing returned by the API, including Buddy, Luna, Max, and all original entries from `script.js`. Search and breed filters apply to the full dataset, without pagination. Names and descriptions are unchanged. All original staff profiles, imagery, statistics, and story copy remain demo content.

Navigation, cards, footers, and form fields are reusable React components. Account forms now create local accounts and log in with email/password. Passwords use salted scrypt hashes; sessions use expiring HttpOnly cookies and hashed database tokens. Log out appears in the shared header while signed in. Third-party sign-in buttons explain that providers are not configured instead of pretending to authenticate. Privacy and Terms display a demo availability message because no such documents existed in the reference.

Contact messages and adoption applications are saved locally. Submission status is shown inline and retained until the next submission. Forms preserve input on errors and block duplicate clicks while saving. There are loading, empty, retry, and not-found states. Applications receive the same field validation in React and Express, including email, phone, length constraints, and server-side dog existence checks.

The reference has no visible search field or filter controls. No new search bar was added. Existing optional name/breed search behavior is exposed through the API and `/dogs?q=Luna&breed=Beagle`, without changing the page layout.

## API

| Method | Endpoint | Result |
| --- | --- | --- |
| GET | `/api/health` | Health status |
| GET | `/api/dogs` | `{ dogs: [...] }`, all original records |
| GET | `/api/dogs?group=featured` | Four home-page dogs |
| GET | `/api/dogs?group=catalog` | Three original Dogs-page dogs |
| GET | `/api/dogs?q=...&breed=...` | Case-insensitive name/breed search and exact breed filter |
| GET | `/api/dogs/:id` | `{ dog: {...} }` or 404 |
| POST | `/api/applications` | Saves application; returns ID and success message |
| POST | `/api/contact` | Saves contact message |
| POST | `/api/auth/signup` | Creates account and session |
| POST | `/api/auth/login` | Creates session |
| GET | `/api/auth/me` | Current user or null |
| POST | `/api/auth/logout` | Revokes current session |

Application JSON:

```json
{
  "dogId": "buddy",
  "name": "Jane Example",
  "email": "jane@example.com",
  "phone": "+27 82 123 4567",
  "address": "12 Example Road"
}
```

`dogId` may be omitted or null for general interest. Contact accepts `name`, `email`, and `message`. Account endpoints accept `email` and `password`. Validation failures return HTTP 400 with `{ message, errors: { field: "message" } }`. Conflict, missing-record, invalid-login, request-size and rate-limit responses use appropriate HTTP status codes. Private applications, messages, and user records have no public listing endpoint.

## Persistence

`DATABASE_PATH` defaults to `data/dogadopt.sqlite`. The first launch imports `server/dogs.json` in a transaction and records a migration marker. Subsequent starts retain listings, applications, messages, accounts, and sessions without reseeding. SQLite transactions and WAL handle concurrent requests. Back up the database using SQLite's backup facilities or stop the process before copying the database files. A writable persistent volume is needed when deploying; ephemeral/serverless storage will not preserve submissions. One database file is intended for a single application deployment.

## Checks

```sh
npm test
npm run build
# Both:
npm run check
```

Tests use temporary SQLite databases and local ephemeral HTTP ports. They cover original data, query filters, individual details, validation, malformed/oversized requests, selected-dog integrity, concurrent writes, persistence across reopening, contact submissions, hashed credentials, session rotation/logout, origin checks, asset serving, and direct route refresh. No test writes to your development database.

Manual smoke checks: open each route at phone/tablet/desktop widths; open and close the menu with Escape; submit invalid and valid adoption data; reload after signup/login; test empty results using `/dogs?q=not-a-dog`; stop Express to check retry/error states. The Loading page preserves the original animation and respects reduced-motion settings.

## Structure

- `client/src/pages/`: React pages; `components/`: shared layout, cards, fields, async states.
- `client/src/migration.css`: limited React integration and request-state styling.
- `client/src/polish.css`: shared visual refinements for typography, spacing, responsive cards and forms, contrast, focus, and request states. It loads after the reference styles and retains their palette and raised outlines.
- `styles.css`, `adopt.css`, `contact.css`, `responsive.css`: original visual reference, imported by React.
- `server/`: Express routes, SQLite setup, and original seed data.
- `shared/validation.js`: frontend/backend validation contract.
- `tests/`: integration and validation tests.

Implementation references: [Vite](https://vite.dev/guide/), [React Router](https://reactrouter.com/start/declarative/routing), [Express](https://expressjs.com/en/5x/guide/error-handling/).
