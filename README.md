
# DogAdopt — Full-Stack Dog Adoption Website

DogAdopt is a full-stack web application I developed using React, Node.js, Express and PostgreSQL. The project started as a static website and gradually evolved into a full-stack application with a backend API, user authentication and database integration.

I used this project to improve my understanding of frontend and backend development, working with REST APIs, managing databases and deploying applications.

**Live Website:** [DogAdopt](https://dogadopt-website-1.onrender.com)  
**Repository:** [DogAdopt-Website](https://github.com/BernardSmall/DogAdopt-Website)

> **Note:** This is a portfolio project and not a real animal adoption service. The dog listings and adoption applications are for demonstration purposes.

## Features

The application includes the following functionality:

- **Dog Listings:** Users can browse dog profiles and view information about individual dogs.
- **Adoption Applications:** Users can submit adoption enquiries for specific dogs or general adoption interest.
- **User Authentication:** Account registration, login and logout functionality with password hashing and session management.
- **Contact Form:** Users can submit contact enquiries that are stored in the database.
- **Responsive Design:** The website supports desktop and mobile devices using reusable React components.
- **Input Validation:** Form submissions are validated on both the frontend and backend.
- **Database Integration:** PostgreSQL is used for hosted environments, with SQLite available for local development.
- **Error Handling:** The application includes loading states, validation feedback and error handling.

## Technologies Used

| Category | Technologies |
|----------|-------------|
| Frontend | React, JavaScript, HTML, CSS, Vite, React Router |
| Backend | Node.js, Express, REST APIs |
| Database | PostgreSQL, Neon, SQLite |
| Authentication | Password Hashing, Session Management, HttpOnly Cookies |
| Testing | Node.js Test Runner |
| Development Tools | Git, GitHub, npm |
| Deployment | Render, Neon |

## Application Architecture

The project uses a client-server architecture with a React frontend, Express backend and a database for storing application data.

```text
React Frontend
      |
      | HTTP Requests
      |
      v
Express REST API
      |
      | Business Logic
      | Validation
      | Authentication
      |
      v
Database
      |
      |-- PostgreSQL (Neon)
      |
      |-- SQLite (Local Development)
```

The frontend communicates with the backend through REST API endpoints. The backend handles database operations, authentication and validation.

I also implemented shared validation rules between the frontend and backend to help keep form validation consistent.

## Getting Started

### Requirements

To run the project locally, you will need:

- Node.js 24 or newer
- npm
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/BernardSmall/DogAdopt-Website.git
cd DogAdopt-Website
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a local environment file using the example provided:

```bash
cp .env.example .env
```

The application uses SQLite by default if a PostgreSQL connection has not been configured.

**4. Start the development server**

```bash
npm run dev
```

The application should be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Database

The project supports two database configurations.

### SQLite

SQLite is used as the local development fallback. This allows the application to run without requiring a cloud database.

When no PostgreSQL connection string is configured, the application stores its data in a local SQLite database.

### PostgreSQL

For deployment, I integrated PostgreSQL using Neon.

The database stores information such as:

- Dog listings
- Adoption enquiries
- Contact messages
- User accounts
- Authentication sessions

Database credentials are managed through environment variables rather than being included in the source code.

To apply PostgreSQL migrations:

```bash
npm run db:migrate
```

The migration process creates the required database structure and imports the initial dog records.

Existing SQLite records are not automatically transferred to PostgreSQL.

## REST API

The backend was developed using Node.js and Express.

It provides endpoints for retrieving dog information, handling form submissions and managing user authentication.

### Dog Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |
| GET | `/api/dogs` | Retrieve dog listings |
| GET | `/api/dogs/:id` | Retrieve a specific dog |
| GET | `/api/dogs?q=...` | Search dog listings |
| GET | `/api/dogs?breed=...` | Filter dogs by breed |

### Application and Contact Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Submit an adoption enquiry |
| POST | `/api/contact` | Submit a contact message |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Retrieve the current user |
| POST | `/api/auth/logout` | Log out |

### Example API Request

An example adoption application request:

```json
{
  "dogId": "buddy",
  "name": "Jane Example",
  "email": "jane@example.com"
}
```

The backend validates the information before saving the application to the database.

Adoption enquiries are stored for demonstration purposes and are not sent to actual animal shelters.

## Authentication

I implemented account registration and login functionality to gain experience working with authentication and session management.

The authentication system includes:

- User registration and login
- Password hashing using scrypt
- Session management using HttpOnly cookies
- Session expiration and logout
- Validation of authentication requests

The application does not currently support password recovery or third-party authentication.

## Testing

The project includes automated tests for backend functionality and application behaviour.

To run the tests:

```bash
npm test
```

To build the application:

```bash
npm run build
```

To run both:

```bash
npm run check
```

The tests cover areas such as:

- Input validation
- Dog listings and filtering
- Database persistence
- User authentication
- Session management
- Adoption and contact submissions
- API error handling
- Application routing

The tests use temporary SQLite databases to avoid affecting development data.

## Deployment

The application is deployed using Render, with PostgreSQL database hosting provided through Neon.

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

The Express server serves the built React application alongside the API.

For production deployments, the relevant environment variables must be configured on the hosting platform.

These include the database connection strings, allowed origins and secure cookie settings.

Database credentials should not be committed to the repository.

## Project Structure

The project is organised into separate frontend, backend and shared functionality.

```text
DogAdopt-Website/
|
|-- client/
|   |-- src/
|       |-- pages/
|       |-- components/
|       |-- styles/
|
|-- server/
|   |-- API and database functionality
|   |-- migrations/
|   |-- dogs.json
|
|-- shared/
|   |-- validation.js
|
|-- scripts/
|   |-- Database migration scripts
|
|-- tests/
|   |-- Automated tests
|
|-- Photos/
|   |-- Image assets
|
|-- .env.example
|-- package.json
|-- README.md
```

## Project Development

DogAdopt originally started as a static website built using HTML, CSS and JavaScript.

As I continued working on it, I decided to expand the project and use it as an opportunity to learn more about full-stack development.

Some of the main improvements I made include:

1. Converting the frontend to React and creating reusable components.
2. Developing a backend using Node.js and Express.
3. Creating REST API endpoints for application functionality.
4. Adding database persistence using SQLite.
5. Implementing user authentication and session management.
6. Integrating PostgreSQL through Neon.
7. Adding automated testing and improving error handling.
8. Deploying the application using Render.

Working on these features helped me develop a better understanding of how different parts of a web application work together.

It also gave me practical experience with debugging, database integration, API development and deployment.

## Current Limitations

DogAdopt is a portfolio project and is not currently used by a real animal adoption organisation.

Some features that are not implemented include:

- Real animal shelter integrations
- Email notifications
- Password recovery
- Third-party login providers
- Real-world adoption processing

The existing forms and functionality are intended for demonstration and testing purposes.

## What I Learned

One of the main goals of this project was to develop my skills beyond frontend development.

Through DogAdopt, I gained practical experience working with REST APIs, connecting a frontend to a backend, managing database operations and handling authentication.

I also learned more about configuring applications for deployment, troubleshooting issues and improving existing code.

The project has been a useful way for me to experiment with different technologies and apply what I have learned during my studies.

---

**Live Website:** [dogadopt-website-1.onrender.com](https://dogadopt-website-1.onrender.com)

**Source Code:** [GitHub Repository](https://github.com/BernardSmall/DogAdopt-Website)
