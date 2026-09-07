# 🦉 Duolingo Clone — Full-Stack Language Learning Platform

A full-stack Duolingo-inspired language learning web application built with **Next.js, TypeScript, FastAPI, SQLAlchemy, and SQLite**.

The application provides a gamified Spanish learning experience with a structured learning path, guided learning through a Guidebook, interactive lessons, XP, streaks, hearts, gems, leaderboard, achievements, and persistent user progress.

---

## 🚀 Live Demo

| Resource | Link |
|---|---|
| 🌐 Frontend | https://duolingo-clone-rudy.vercel.app/ |
| ⚙️ Backend API | https://duolingo-clone-rudy-1.onrender.com/ |
| 📖 API Documentation | https://duolingo-clone-rudy-1.onrender.com/docs |
| 💻 GitHub Repository | https://github.com/Rudy-web1/duolingo-clone-rudy |

---

# ✨ Features

## 📚 Learning Path / Skill Tree

The application provides a structured learning path inspired by Duolingo's course progression.

Features include:

- Unit-based course organization
- Skill-based progression
- Locked and unlocked skills
- Current skill indicator
- Skill completion tracking
- Crown-based progression
- Lesson progression
- Continue functionality
- Review functionality
- Visual progress indicators
- Dedicated **📖 LEARN** option for every skill

The seeded course currently contains:

📖 Guidebook — Learn Before Practice

A dedicated Guidebook learning system was added to make the application more than an exercise-only platform.

Users can select:
8 Units
27 Skills
81 Lessons
324 Exercises

The Guidebook provides:

Skill introduction
Vocabulary explanations
Spanish → English learning cards
Example usage
Learning tips
Text-to-speech pronunciation
Card-by-card progression
Transition from learning into practice
The intended learning flow is:

        Skill
          │
          ▼
      📖 Learn
          │
          ▼
    Teaching Cards
          │
          ▼
    Practice Lesson
          │
          ▼
   Instant Feedback
          │
          ▼
    XP + Progress

This separates teaching from testing and provides a more realistic learning experience.

🎯 Interactive Lessons

Lessons contain multiple exercise formats.

Supported exercise types include:

Multiple choice
Vocabulary translation
Word-bank translation
Sentence translation
Typed answers
Fill-in-the-blank style exercises
Matching exercises

The frontend sends answers to the FastAPI backend for validation.

The lesson interface includes:

Progress bar
Question counter
Hearts
Immediate correct/incorrect feedback
Mistake tracking
Out-of-hearts state
Lesson completion
XP rewards
Skill progress updates
❤️ Hearts System

A Duolingo-inspired hearts system is implemented.

Users can:

Start with a limited number of hearts
Lose hearts while making mistakes
Reach an out-of-hearts state
Refill their hearts
Persist their current heart count
🔥 Streak System

The application tracks the user's learning streak.

User statistics include:

Current streak
Total XP
Daily XP goal
Learning progress

The streak is stored on the backend so that user progress persists across sessions.

⚡ XP and Gamification

Users earn XP by completing lessons.

XP contributes to:

Overall progress
Daily XP goals
Leaderboard ranking
Profile statistics

Additional gamification elements include:

Crowns
Hearts
Gems
Streaks
Achievements
Leaderboard rankings
🏆 Leaderboard

The leaderboard ranks users according to XP.

It displays:

User ranking
Username
XP
Current-user highlighting

Seeded users are included so that the leaderboard can be demonstrated without requiring multiple real accounts.

👤 Profile

The profile page displays the user's learning statistics.

Information includes:

Total XP
Current streak
Hearts
Gems
Completed skills
Achievements
Learning statistics
🛠️ Tech Stack
Frontend
Next.js 14
React
TypeScript
Tailwind CSS
Lucide React
Backend
Python
FastAPI
SQLAlchemy
Pydantic
Uvicorn
Database
SQLite
SQLAlchemy ORM
Deployment
Vercel — Frontend
Render — Backend
Version Control
Git
GitHub
🏗️ Architecture Overview

The application follows a client-server architecture.

                         ┌─────────────────┐
                         │      USER       │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │    Next.js Frontend     │
                    │                         │
                    │  Learning Path          │
                    │  Guidebook              │
                    │  Lessons                │
                    │  Profile                │
                    │  Leaderboard            │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │     FastAPI Backend     │
                    │                         │
                    │  Users                  │
                    │  Path                   │
                    │  Guidebook              │
                    │  Lessons                │
                    │  Exercises              │
                    │  Progress               │
                    │  Leaderboard            │
                    └────────────┬────────────┘
                                 │
                                 │ SQLAlchemy ORM
                                 ▼
                    ┌─────────────────────────┐
                    │         SQLite          │
                    │                         │
                    │  Users                  │
                    │  Courses                │
                    │  Units                  │
                    │  Skills                 │
                    │  Lessons                │
                    │  Exercises              │
                    │  Progress               │
                    │  Achievements           │
                    └─────────────────────────┘
Frontend Architecture

The frontend uses the Next.js App Router and reusable React components.

frontend/
└── src/
    ├── app/
    │   ├── guidebook/
    │   ├── leaderboard/
    │   ├── lesson/
    │   ├── profile/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    │
    ├── components/
    │   ├── layout/
    │   ├── lesson/
    │   ├── modals/
    │   ├── path/
    │   ├── Sidebar.tsx
    │   └── TopBar.tsx
    │
    └── lib/
        ├── api.ts
        └── types.ts

The frontend API layer centralizes communication with the backend.

Backend Architecture
backend/
└── app/
    ├── routers/
    │   ├── guidebook.py
    │   ├── lessons.py
    │   ├── path.py
    │   └── users.py
    │
    ├── database.py
    ├── main.py
    ├── models.py
    ├── schemas.py
    └── seed.py

The backend is separated into feature-specific routers while SQLAlchemy models manage database persistence.

🗄️ Database Schema

The application uses SQLite as the database and SQLAlchemy ORM for database access.

Entity Relationship Overview
                         ┌──────────────┐
                         │    Course    │
                         └──────┬───────┘
                                │
                                │ 1 : N
                                ▼
                         ┌──────────────┐
                         │     Unit     │
                         └──────┬───────┘
                                │
                                │ 1 : N
                                ▼
                         ┌──────────────┐
                         │    Skill     │
                         └──────┬───────┘
                                │
                                │ 1 : N
                                ▼
                         ┌──────────────┐
                         │    Lesson    │
                         └──────┬───────┘
                                │
                                │ 1 : N
                                ▼
                         ┌──────────────┐
                         │   Exercise   │
                         └──────────────┘


┌──────────────┐
│     User     │
└──────┬───────┘
       │
       ├───────────────────────────────┐
       │                               │
       ▼                               ▼
┌──────────────────────┐      ┌────────────────────┐
│ UserSkillProgress    │      │ LessonCompletion   │
└──────────┬───────────┘      └─────────┬──────────┘
           │                            │
           ▼                            ▼
         Skill                        Lesson


       User
         │
         ▼
┌──────────────────────┐
│ UserAchievement      │
└──────────┬───────────┘
           │
           ▼
      Achievement
Main Tables
users

Stores user and gamification information.

Field	Purpose
id	Unique user identifier
username	User name
xp_total	Total XP earned
streak_count	Current streak
hearts	Current available hearts
gems	User gems
daily_goal_xp	Daily XP target
courses

Stores language courses.

Field	Purpose
id	Unique course identifier
title	Course title
language	Language being learned
units

Groups related skills.

Field	Purpose
id	Unique unit identifier
course_id	Parent course
title	Unit title
description	Unit description
order_index	Unit position
skills

Represents an individual learning topic.

Field	Purpose
id	Unique skill identifier
unit_id	Parent unit
title	Skill title
icon	Skill icon
max_crowns	Maximum crown level
lessons

Contains lessons belonging to a skill.

Field	Purpose
id	Unique lesson identifier
skill_id	Parent skill
order_index	Lesson order
xp_reward	XP awarded on completion
exercises

Stores individual exercises.

Field	Purpose
id	Unique exercise identifier
lesson_id	Parent lesson
type	Exercise type
question	Exercise content
answer	Expected answer
order_index	Exercise order
user_skill_progress

Stores user-specific skill progress.

Field	Purpose
id	Unique progress identifier
user_id	User
skill_id	Skill
is_unlocked	Skill unlock state
crowns	Earned crowns
is_completed	Skill completion state
lesson_completions

Records completed lessons.

Field	Purpose
id	Unique completion identifier
user_id	User
lesson_id	Completed lesson
mistakes	Mistakes during lesson
hearts_lost	Hearts lost
achievements

Stores available achievements.

Field	Purpose
id	Unique achievement identifier
title	Achievement name
description	Achievement description
user_achievements

Associates users with achievements.

Field	Purpose
id	Unique record
user_id	User
achievement_id	Achievement
Database Relationships
Course 1 ───────── N Unit

Unit 1 ─────────── N Skill

Skill 1 ────────── N Lesson

Lesson 1 ───────── N Exercise

User 1 ─────────── N UserSkillProgress

Skill 1 ────────── N UserSkillProgress

User 1 ─────────── N LessonCompletion

Lesson 1 ───────── N LessonCompletion

User 1 ─────────── N UserAchievement

Achievement 1 ──── N UserAchievement
🌱 Database Seeding

The backend includes a seed process that initializes the application with demo learning content.

On startup:

Database tables are created if required.
Course data is initialized.
Units and skills are created.
Lessons and exercises are created.
Achievements are created.
A demo user is created.
Initial skill progress is configured.

Current seeded content:

8 Units
27 Skills
81 Lessons
324 Exercises

The seeded demo user has initial XP, streak, hearts, gems, and skill progress so the application can be used immediately after setup.

🔌 API Overview

The frontend communicates with FastAPI through REST endpoints.

Learning Path
GET /api/path?user_id=1

Returns:

Units
Skills
Lessons
Unlock state
Crown progress
Completion state
User
GET /api/users/{user_id}

Returns user statistics such as XP, streak, hearts, and gems.

Guidebook
GET /api/guidebook/{skill_id}

Returns:

Skill information
Introduction
Teaching cards
Lesson information
Progress
Next lesson
Lesson
GET /api/lessons/{lesson_id}

Returns lesson information and exercises.

Answer Checking
POST /api/exercises/{exercise_id}/check?user_id=1

Validates a submitted answer.

Complete Lesson
POST /api/lessons/complete?user_id=1

Updates lesson completion, XP, and skill progress.

Hearts Refill
POST /api/users/{user_id}/hearts/refill

Refills the user's hearts.

Leaderboard
GET /api/leaderboard?user_id=1

Returns leaderboard rankings.

Profile
GET /api/users/{user_id}/profile

Returns profile information, statistics, and achievements.

💻 Setup Instructions
Prerequisites

Install the following:

Python 3.10+
Node.js 18+
Git
1. Clone the Repository
git clone https://github.com/Rudy-web1/duolingo-clone-rudy.git
cd duolingo-clone-rudy
2. Backend Setup

Navigate to the backend:

cd backend

Create a virtual environment:

py -m venv .venv

Activate the virtual environment:

.venv\Scripts\activate

Install Python dependencies:

pip install -r requirements.txt

Start the FastAPI server:

py -m uvicorn app.main:app --reload

The backend will run at:

http://localhost:8000

FastAPI Swagger documentation:

http://localhost:8000/docs
3. Frontend Setup

Open a second terminal.

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Create a file named:

.env.local

inside the frontend directory.

Add:

NEXT_PUBLIC_API_URL=http://localhost:8000

Start the Next.js development server:

npm run dev

The frontend will run at:

http://localhost:3000
🔧 Environment Variables
Local Development

The frontend connects to the local FastAPI server:

NEXT_PUBLIC_API_URL=http://localhost:8000
Production

The deployed frontend connects to the Render backend:

NEXT_PUBLIC_API_URL=https://duolingo-clone-rudy-1.onrender.com

The local .env.local file should not be committed to the repository.

🧪 Testing the Application

After starting both servers:

Open http://localhost:3000
Open the Learning Path
Select an unlocked skill
Try the 📖 LEARN Guidebook
Move through the teaching cards
Start a lesson
Answer exercises
Verify immediate feedback
Complete the lesson
Verify XP and skill progress
Check the leaderboard
Check the profile page
🏭 Production Deployment
Frontend

The Next.js frontend is deployed using Vercel.

Production URL:

https://duolingo-clone-rudy.vercel.app/

The production environment variable is:

NEXT_PUBLIC_API_URL=https://duolingo-clone-rudy-1.onrender.com
Backend

The FastAPI backend is deployed using Render.

Production URL:

https://duolingo-clone-rudy-1.onrender.com/

API documentation:

https://duolingo-clone-rudy-1.onrender.com/docs
📌 Assumptions

The following assumptions were made during development:

1. Simplified Authentication

Authentication is simplified for the assignment.

A seeded demo user is used instead of implementing a complete production authentication system.

This allows the evaluator to immediately access the learning experience.

2. SQLite Database

SQLite is used as the application database.

This keeps the project lightweight and easy to run locally and deploy for the scope of the assignment.

3. Seeded Learning Content

Course content is seeded by the backend.

The application does not require manual database population before it can be demonstrated.

4. Seeded Leaderboard

The leaderboard contains seeded users so that rankings can be demonstrated without requiring multiple real accounts.

5. Spanish Course

The current course focuses on Spanish learning.

The database structure separates courses from units and skills so additional languages could be added later.

6. Guidebook Content

Guidebook teaching content is maintained as backend content definitions rather than as a separate database table.

This keeps the implementation simple while still allowing Guidebook content to be delivered through an API.

7. Mocked / Simplified Features

Some advanced features such as real authentication, payments, social interaction, and advanced speech recognition are outside the core assignment scope.

8. Duolingo-Inspired Design

The application is inspired by the general gamified language-learning experience of Duolingo.

It is an educational project and is not affiliated with or endorsed by Duolingo.

📊 Project Highlights

The project demonstrates the following full-stack concepts:

Frontend
Next.js App Router
React component architecture
TypeScript
Responsive UI
Client-side API integration
Interactive lesson state management
Backend
FastAPI REST APIs
SQLAlchemy ORM
Pydantic schemas
Modular routers
Database seeding
Persistent application state
Database
Relational data modeling
One-to-many relationships
User-specific progress
Lesson completion tracking
Achievement relationships
Full-Stack Integration
Next.js
   │
   │ HTTP / REST
   ▼
FastAPI
   │
   │ SQLAlchemy
   ▼
SQLite

The frontend and backend are independently deployable and communicate through a REST API.

👨‍💻 Author

Rudraksh Singh

Full-Stack Development Project

📜 License

This project was created for educational and demonstration purposes.

It is not affiliated with or endorsed by Duolingo.


### After pasting it

Save the file as:

```text
README.md

in the root of:

duolingo-clone-rudy/

Then run:

git add README.md
git commit -m "Improve project README"
git push origin main

That's it. No code changes and no Vercel redeployment are needed for the README.
