# Duolingo Web App Clone

A functional clone of Duolingo's lesson loop and gamification mechanics, built for the
SDE Fullstack Assignment.

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** FastAPI (Python) + SQLAlchemy
- **Database:** SQLite (file-based, auto-created and auto-seeded on first run)

---

## ⚡ Quick start (local dev)

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- The database (`duolingo.db`) and seed data (one Spanish course, 2 units, 6 skills,
  varied exercises, a default learner `user_id=1`, and 5 more seeded users for the
  leaderboard) are created **automatically on first startup**. Delete `duolingo.db`
  and restart to reseed from scratch.

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local     # points to http://localhost:8000
npm install
npm run dev
```

- App: http://localhost:3000

Run backend and frontend in two terminals; both must be running for the app to work.

---

## 🏗 Architecture overview

```
backend/
  app/
    main.py          FastAPI app, CORS, router wiring, startup auto-seed
    database.py       SQLAlchemy engine/session setup (SQLite)
    models.py          ORM models (see schema below)
    schemas.py        Pydantic request/response contracts
    seed.py             Seeds course content + default learner + leaderboard users
    routers/
      path.py           GET /api/path              -> skill tree + user HUD
      lessons.py        GET  /api/lessons/{id}       -> exercises for a lesson
                         POST /api/exercises/{id}/check -> grade one answer
                         POST /api/lessons/complete   -> XP/streak/crowns/unlocks/achievements
      users.py          GET  /api/users/{id}
                         POST /api/users/{id}/hearts/refill
                         GET  /api/leaderboard
                         GET  /api/users/{id}/profile

frontend/
  src/
    app/
      page.tsx                      Home: the learning path / skill tree
      lesson/[lessonId]/page.tsx    The lesson player (core loop)
      profile/page.tsx              Stats + achievements
      leaderboard/page.tsx          Seeded leaderboard
      layout.tsx / globals.css      Font (Nunito) + Duolingo-style design tokens
    components/
      TopBar.tsx                    Streak / XP / gems / hearts HUD
      path/  SkillNode.tsx, PathView.tsx        Zigzag skill-tree path
      lesson/  LessonHeader.tsx, FeedbackBar.tsx, ExerciseRenderer.tsx
        exercises/  MultipleChoice, Translate, MatchPairs, FillBlank, TypeAnswer
      modals/  LessonCompleteModal.tsx, OutOfHeartsModal.tsx
    lib/
      api.ts     Typed fetch client for the backend
      types.ts    Shared TS types mirroring the Pydantic schemas
```

**Design pattern for exercises:** every exercise type stores its type-specific payload
as JSON (`data_json` / `correct_answer_json`) on a single `exercises` table rather than
one table per type. This keeps the schema simple while still supporting arbitrarily
different shapes (option lists, word banks, match pairs, etc). The frontend has one
React component per exercise `type`, all sharing the same `onAnswerChange` /
`locked` / `result` contract, switched by `ExerciseRenderer.tsx`.

---

## 🗄 Database schema

| Table | Purpose | Key columns |
|---|---|---|
| `users` | Learner + gamification state | xp_total, xp_today, streak_count, last_activity_date, hearts, max_hearts, gems |
| `courses` | A language course | name, language_code |
| `units` | Groups of skills, shown as colored banners on the path | course_id, order_index, color_hex |
| `skills` | A node on the path (e.g. "Basics 1") | unit_id, order_index, max_crowns |
| `lessons` | One "crown level" within a skill | skill_id, order_index, xp_reward |
| `exercises` | One question within a lesson | lesson_id, type, prompt, data_json, correct_answer_json |
| `user_skill_progress` | Per-user, per-skill unlock/crown state | user_id, skill_id, is_unlocked, crowns, is_completed |
| `lesson_completions` | History log of finished lessons | user_id, lesson_id, xp_earned, mistakes, accuracy, completed_at |
| `achievements` | Badge catalog | code, title, icon |
| `user_achievements` | Which badges a user has earned | user_id, achievement_id, earned_at |

Relationships: `Course 1—N Unit 1—N Skill 1—N Lesson 1—N Exercise` (content tree,
seeded once). `User 1—N UserSkillProgress` and `User 1—N LessonCompletion` (per-user
state, grows as the user plays).

---

## 🔑 Key assumptions

- **Auth is simplified**, per the assignment spec: there's a single default logged-in
  learner (`user_id = 1`, username `you`). All frontend API calls default to this ID
  (see `DEFAULT_USER_ID` in `frontend/src/lib/api.ts`). Swapping in real auth later
  just means replacing that constant with a session-derived user id.
- **Streak logic** is date-based (`last_activity_date` vs `date.today()`), not a cron
  job — it's recomputed on every `lesson/complete` call, which is easy to unit-test by
  freezing/mocking `date.today()`.
- **Hearts regenerate** 1 every 30 minutes (`HEART_REGEN_MINUTES` in `users.py`),
  checked lazily on read rather than via a background worker. A "refill" also mocks
  spending 350 gems, or free "practice" refill if gems are insufficient.
- **Exercise answer checking** happens server-side (`POST /api/exercises/{id}/check`)
  so the lesson payload sent to the browser never includes the correct answer —
  matches Duolingo's actual behavior and avoids trivial cheating via devtools.
- Accent-insensitive/typo-tolerant grading is **not** implemented for `type_answer`
  (e.g. typing `perdon` for `perdón` will be marked wrong) — acceptable for this
  assignment's scope but called out as a known simplification.

---

## 🚀 Deployment

- **Backend:** Render / Railway — set the start command to
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. SQLite file storage works for a
  demo but isn't persistent across redeploys on most PaaS free tiers; swap
  `DATABASE_URL` in `database.py` for a hosted Postgres URL for a permanent deploy if needed.
- **Frontend:** Vercel — set `NEXT_PUBLIC_API_URL` to your deployed backend URL as an
  environment variable, then `vercel deploy`.

---

## 📋 Progress log (for resuming this build in a new AI session)

If you're picking this project up in a fresh chat: upload/paste this whole repo and
say "continue building this Duolingo clone, see README progress log." Status as of
this checkpoint:

**✅ Done**
- Full backend: models, schema, seed data, all API routes (path, lesson player,
  answer checking, lesson completion w/ XP+streak+crowns+unlock+achievements logic,
  hearts regen/refill, leaderboard, profile).
- Full frontend: design system (Tailwind tokens + 3D-pressed-button CSS matching
  Duolingo's look), home path/skill-tree screen, lesson player with all 5 exercise
  types, feedback bar, out-of-hearts modal, lesson-complete modal, profile page,
  leaderboard page.
- Verified: all backend `.py` files pass `python -m py_compile` (syntax-clean). All
  frontend `.tsx`/`.ts` files pass a bracket-balance sanity check. **Not yet
  live-tested** (`npm install` / `uvicorn` run) because this sandbox has no network
  access — do that first when you resume, it's the highest-value next step.

**🔲 Not yet built / good next steps**
1. **Run it for real**: `pip install -r backend/requirements.txt`, `npm install` in
   `frontend/`, boot both, fix anything a live run surfaces (likely just minor
   Next.js/Tailwind version-compat nits).
2. **Settings page** is a placeholder only ("Coming Soon") — fine per spec but could
   be fleshed out.
3. **Bonus features** not yet started: dark mode, responsive polish pass on small
   screens, TTS/audio for exercises, timed "legendary" practice mode.
4. **Tests**: no automated tests yet (pytest for backend streak/XP logic would be
   high-value given it's explicitly called out as "testable" in the assignment).
5. Consider adding a `docker-compose.yml` for one-command local spin-up.

Backend and frontend are otherwise fully wired end-to-end — every screen calls a
real endpoint, nothing is hardcoded/mocked in the UI beyond what the assignment
explicitly allows as placeholders (audio, real auth, IAP/gems purchase flow, social).
