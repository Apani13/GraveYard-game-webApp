# GraveYard Garden — Web Game

A backend-driven web game built with **Spring Boot**, designed to explore API design, authentication, persistence, and domain modeling, with a lightweight browser frontend used to exercise and validate backend behavior.

The project focuses on how backend responsibilities (security, data modeling, business logic) integrate with a client application in a clear and maintainable way.

---

## What this project demonstrates

- **Backend architecture**
    - Layered design (controllers, services, persistence)
    - Clear separation of concerns
    - Domain-driven organization around game concepts

- **API design**
    - RESTful endpoints with explicit responsibilities
    - DTO usage to decouple API contracts from persistence models

- **Authentication & authorization**
    - JWT-based authentication
    - Role-based access control (USER / ADMIN)
    - Endpoint protection with Spring Security

- **Persistence**
    - JPA / Hibernate with an H2 file database
    - Automatic schema updates during development

- **Client integration**
    - A minimal HTML/CSS/JavaScript frontend
    - Authenticated requests via the Fetch API
    - Frontend used as a consumer of the backend API

---

## Tech stack

**Backend**
- Java 21
- Spring Boot (Web, Security, Data JPA)
- JWT
- H2 (development)

**Client**
- HTML · CSS · JavaScript (no framework)

---

## Running the project locally

```bash
git clone https://github.com/Apani13/GraveYard-game-webApp.git
cd GraveYard-game-webApp
./mvnw spring-boot:run
```

The application runs locally at `http://localhost:8080`.

### UI pages
- Public: `/login.html`, `/register.html`
- Requires authentication: `/game.html`
- Requires ADMIN role: `/admin.html`

---

## API overview

**Authentication**
- `POST /auth/register` — create a player account
- `POST /auth/login` — authenticate and receive a JWT

**Summons (gameplay domain)**

Summons represent a core domain concept. Creating, modifying, and removing summons is part of the game logic and available to authenticated users.

- `GET /summons` — list available summons
- `POST /summons` — create a new summon (game action)
- `PUT /summons/{id}` — update a summon
- `DELETE /summons/{id}` — remove a summon

**Admin**
- `GET /admin/users` — admin-only user management

---

## Project structure

```
src/main/java/
  backend/
    security/    # Authentication, JWT, access rules
    summon/      # Game domain (entities, services, controllers)
    user/        # Users, roles, admin endpoints

src/main/resources/
  static/        # HTML, CSS, JS client
  application.properties
```

---

## Database (development)

The application uses an **H2 file database** for local development.

H2 Console:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/summondb`

The database is persisted locally and automatically updated via JPA during development.

---

## Notes

This project is intentionally scoped as a **backend-focused learning application**, prioritizing correctness, clarity, and architectural decisions. The frontend exists primarily to exercise and validate backend behavior.