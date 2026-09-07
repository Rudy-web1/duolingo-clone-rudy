import type {
  PathResponse, LessonDetail, AnswerResult, LessonCompleteResponse,
  HeartsRefillResponse, LeaderboardEntry, ProfileResponse, UserOut,
} from "./types";

// Assumption (per assignment spec): auth is simplified to a single default
// logged-in learner, seeded as user id 1 ("you").
export const DEFAULT_USER_ID = 1;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${body}`);
  }
  return res.json();
}

export const api = {
  getPath: (userId: number = DEFAULT_USER_ID) =>
    request<PathResponse>(`/api/path?user_id=${userId}`),

  getUser: (userId: number = DEFAULT_USER_ID) =>
    request<UserOut>(`/api/users/${userId}`),

  getLesson: (lessonId: number) =>
    request<LessonDetail>(`/api/lessons/${lessonId}`),

  checkAnswer: (exerciseId: number, answer: any, userId: number = DEFAULT_USER_ID) =>
    request<AnswerResult>(`/api/exercises/${exerciseId}/check?user_id=${userId}`, {
      method: "POST",
      body: JSON.stringify({ exercise_id: exerciseId, answer }),
    }),

  completeLesson: (lessonId: number, mistakes: number, heartsLost: number, userId: number = DEFAULT_USER_ID) =>
    request<LessonCompleteResponse>(`/api/lessons/complete?user_id=${userId}`, {
      method: "POST",
      body: JSON.stringify({ lesson_id: lessonId, mistakes, hearts_lost: heartsLost }),
    }),

  refillHearts: (userId: number = DEFAULT_USER_ID) =>
    request<HeartsRefillResponse>(`/api/users/${userId}/hearts/refill`, { method: "POST" }),

  getLeaderboard: (userId: number = DEFAULT_USER_ID) =>
    request<LeaderboardEntry[]>(`/api/leaderboard?user_id=${userId}`),

  getProfile: (userId: number = DEFAULT_USER_ID) =>
    request<ProfileResponse>(`/api/users/${userId}/profile`),
};
