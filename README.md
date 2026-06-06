# Algorithm Learning Lab

MERN web app for learning basic algorithms with animated mock data, algorithm pages, quizzes, code examples, authentication, and connected MongoDB schemas for users, games, and scores.

## Project Structure

- `backend/` Express API, MongoDB connection, auth middleware, routes, schemas, seed data
- `frontend/src/pages/` Route-level pages
- `frontend/src/components/` Reusable UI pieces
- `frontend/src/contexts/` React context files, with context and provider split into separate files
- `frontend/src/utils/` API and algorithm-step helpers
- `frontend/src/assets/` Local algorithm content and visual constants
- `project.md` Original brief

## Run Locally

1. Install dependencies:

```bash
npm run install:all
```

2. Create backend environment file:

```bash
cp backend/.env.example backend/.env
```

3. Start MongoDB locally or set `MONGODB_URI` in `backend/.env`.

4. Seed algorithms and quiz games:

```bash
npm run seed --prefix backend
```

5. Start frontend and backend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`. Backend runs at `http://localhost:5000`.

## Verification

```bash
npm run lint --prefix frontend
npm run build --prefix frontend
node --check backend/src/server.js
```
