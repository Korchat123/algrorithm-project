# CODEX.md

Guidance for AI coding agents working in this repository.

## Project Overview

Algorithm Learning Lab is a MERN app for learning algorithms through explanations, animated visualizations, quizzes, games, auth, and score tracking.

- `frontend/` is a Vite React app.
- `backend/` is an Express API using MongoDB through Mongoose.
- `algorithm/` and `array-method/` contain standalone learning examples.
- `project.md` contains the original project brief.

## Common Commands

From the repository root:

```bash
npm run install:all
npm run dev
npm run build
npm run lint
```

Backend-only commands:

```bash
npm run dev --prefix backend
npm run start --prefix backend
npm run seed --prefix backend
node --check backend/src/server.js
```

Frontend-only commands:

```bash
npm run dev --prefix frontend
npm run build --prefix frontend
npm run lint --prefix frontend
```

## Environment

- The backend expects a `backend/.env` file.
- Set `MONGODB_URI` for the database connection.
- The frontend normally runs on `http://localhost:5173`.
- The backend normally runs on `http://localhost:5000`.

## Architecture Notes

- Keep route-level React views in `frontend/src/pages/`.
- Keep reusable React UI in `frontend/src/components/`.
- Keep auth state in `frontend/src/contexts/`.
- Keep API helpers in `frontend/src/utils/`.
- Keep backend routes in `backend/src/routes/`.
- Keep backend schemas in `backend/src/models/`.
- Keep backend configuration in `backend/src/config/`.
- Keep backend middleware in `backend/src/middleware/`.

## Frontend Conventions

- Use functional React components.
- Prefer existing CSS classes and layout patterns in `frontend/src/styles.css`.
- Use `lucide-react` icons when an icon is needed.
- Keep algorithm visualizations responsive and readable on mobile.
- Do not add marketing-style landing content when implementing app functionality; build the usable screen.

## Backend Conventions

- Use ES modules.
- Keep controllers and route handlers scoped to their domain route file unless shared behavior is clearly needed.
- Use Mongoose models for persisted data.
- Protect authenticated routes with the existing auth middleware.
- Keep seed data deterministic enough for repeatable local testing.

## Verification

Before finishing meaningful changes, run the smallest relevant checks:

```bash
npm run lint --prefix frontend
npm run build --prefix frontend
node --check backend/src/server.js
```

For backend behavior that depends on database state, also run:

```bash
npm run seed --prefix backend
```

## Editing Guidance

- Keep changes scoped to the requested feature or bug.
- Follow existing file organization before introducing new folders or abstractions.
- Avoid rewriting unrelated code.
- Do not commit generated logs or local environment files.
- If the working tree has unrelated changes, leave them intact.
