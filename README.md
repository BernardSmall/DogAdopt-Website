DogAdopt — Full-Stack Dog Adoption Platform
A responsive full-stack dog adoption website built with React, Node.js, Express, and PostgreSQL. DogAdopt is a portfolio project demonstrating frontend development, REST APIs, database persistence, authentication, testing, and deployment.

Live demo · GitHub repository
Portfolio demonstration: This is not an operating animal rescue service. Dog listings and adoption enquiries are demonstrations; submissions do not contact a shelter or initiate a real adoption.

Features
- Dog catalogue and profiles: Browse available dog profiles and view individual dog details. API supports search and breed filters.
- Adoption interest forms: Submit an enquiry for a selected dog or general adoption interest, with frontend and backend validation.
- Accounts: Register, log in, maintain a session, and log out. Passwords are hashed and sessions use HttpOnly cookies.
- Contact form: Store enquiries through the Express backend.
- Responsive interface: React components, client-side routing, loading/empty/error states, and mobile-friendly layouts.
- Persistent storage: PostgreSQL via Neon in hosted environments, with SQLite as a local development fallback.
Tech stack
Area	Technologies
Frontend	React 19, Vite, React Router, JavaScript, HTML, CSS
Backend	Node.js 24+, Express 5, REST APIs
Database	PostgreSQL (Neon), SQLite (local fallback), SQL
Security	Scrypt password hashing, HttpOnly sessions, input validation, rate limiting
Testing and tools	Node.js test runner, Git, GitHub, npm


Architecture
React + Vite frontend
        |
        | HTTP /api
        v
Node.js + Express API
        |
        +-- PostgreSQL (Neon; DATABASE_URL configured)
        |
        +-- SQLite (local development fallback)
The API manages database access, input validation, and authentication. Client and server share input-validation rules through shared/validation.js. Database credentials stay on the server.
Run locally
Requirements: Node.js 24 or newer, npm.
git clone https://github.com/BernardSmall/DogAdopt-Website.git
cd DogAdopt-Website
npm install
cp .env.example .env
npm run dev
Open http://localhost:5173. The API runs on http://localhost:3001 by default. If DATABASE_URL is unset, the app uses a local SQLite database (./data/dogadopt.sqlite) without requiring a cloud account.
Production build
npm run build
npm start
The Express server serves the compiled frontend and API. In hosted environments, use the platform PORT. Configure NODE_ENV=production, COOKIE_SECURE=true, and ALLOWED_ORIGINS for HTTPS hosting.
PostgreSQL / Neon
The project supports a hosted PostgreSQL database via Neon. Keep DATABASE_URL and DATABASE_URL_UNPOOLED in private server-side environment variables; do not commit secrets.
npm run db:migrate
npm run build
npm start
The migration script seeds dog data on first setup and tracks applied migrations. For a Neon-linked environment, neon deploy can populate local environment secrets. See .env.example and the migration scripts for configuration details. Existing local SQLite records are not automatically migrated to PostgreSQL.
API endpoints
Method	Endpoint	Purpose
GET	/api/health	Health check
GET	/api/dogs	Dog listings, optionally filtered with q, breed, or group
GET	/api/dogs/:id	Individual dog details
POST	/api/applications	Save a demonstration adoption enquiry
POST	/api/contact	Save a contact message
POST	/api/auth/signup	Create an account and session
POST	/api/auth/login	Log in
GET	/api/auth/me	Current signed-in user
POST	/api/auth/logout	End a session


Example adoption enquiry:
{
  "dogId": "buddy",
  "name": "Jane Example",
  "email": "jane@example.com"
}
dogId may be omitted for general interest. Server-side validation checks submitted fields and dog selections. Contact messages and adoption enquiries are stored for demonstration purposes, not emailed to shelters.
Testing
npm test
npm run build
# Or run both:
npm run check
The automated tests cover validation, dog listings and search, persistence, authentication and sessions, submissions, request protection, and application routing. Tests use temporary local SQLite databases.
Project structure
client/src/          React pages, components and styles
server/              Express API, database logic, seed data, migrations
shared/validation.js Shared validation rules
scripts/             Database migration and smoke-test scripts
tests/               Automated tests
Photos/              Image assets
The project began as a static website recreation and evolved into a React application with a backend, authentication, and persistent database storage. Some original HTML/CSS assets remain as references. Active frontend routes include /, /about, /dogs, /dogs/:id, /adopt, /contact, /login, and /signup.
Limitations
DogAdopt is a learning and portfolio application rather than an operational adoption service. It does not provide password recovery, third-party OAuth, or real email delivery. Use fictional details when testing forms.
