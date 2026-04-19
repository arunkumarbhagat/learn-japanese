# JapanLearn — Full-Stack Japanese Learning Platform

## Quick Start

### 1. Seed the Database
```bash
cd backend
npm run seed
```

### 2. Start the Backend
```bash
cd backend
npm run dev
```
Runs on http://localhost:5000

### 3. Start the Frontend
```bash
cd frontend
npm start
```
Runs on http://localhost:3000

---

## Project Structure

```
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express API routes
│   ├── middleware/       # JWT auth middleware
│   ├── seed/            # Database seed scripts
│   └── server.js
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Route pages
        ├── context/     # Auth context
        └── services/    # Axios API client
```

## Features
- Hiragana & Katakana chart + flashcard mode
- Kanji browser (N5–N1) with readings, meanings, examples
- Vocabulary & Grammar with level filtering and search
- Practice Mode: dynamic quiz generator (6 quiz types)
- Test Mode: JLPT-style timed exams with 4 sections
- User auth (JWT), progress tracking, spaced repetition (SM-2)
- Dashboard with charts
