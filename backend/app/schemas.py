"""
Pydantic schemas — the shapes the API sends/receives.
Kept separate from ORM models (models.py) so DB structure and API
contract can evolve independently.
"""
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime, date


# ---------- User / gamification ----------

class UserOut(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_color: str
    xp_total: int
    xp_today: int
    daily_goal_xp: int
    streak_count: int
    longest_streak: int
    last_activity_date: Optional[date]
    hearts: int
    max_hearts: int
    gems: int

    class Config:
        from_attributes = True


# ---------- Path / skill tree ----------

class LessonBrief(BaseModel):
    id: int
    order_index: int
    xp_reward: int

    class Config:
        from_attributes = True


class SkillOut(BaseModel):
    id: int
    title: str
    icon: str
    order_index: int
    max_crowns: int
    crowns: int = 0
    is_unlocked: bool = False
    is_completed: bool = False
    lessons: List[LessonBrief] = []

    class Config:
        from_attributes = True


class UnitOut(BaseModel):
    id: int
    title: str
    description: str
    color_hex: str
    order_index: int
    skills: List[SkillOut] = []

    class Config:
        from_attributes = True


class CourseOut(BaseModel):
    id: int
    name: str
    language_code: str
    flag_emoji: str
    units: List[UnitOut] = []

    class Config:
        from_attributes = True


class PathResponse(BaseModel):
    course: CourseOut
    user: UserOut


# ---------- Lesson player ----------

class ExerciseOut(BaseModel):
    id: int
    order_index: int
    type: str
    prompt: str
    data: Any  # decoded JSON, shape depends on `type`

    class Config:
        from_attributes = True


class LessonDetail(BaseModel):
    id: int
    skill_id: int
    skill_title: str
    order_index: int
    xp_reward: int
    exercises: List[ExerciseOut]


class AnswerSubmit(BaseModel):
    exercise_id: int
    answer: Any  # shape depends on exercise type (string, list, or dict)


class AnswerResult(BaseModel):
    correct: bool
    correct_answer: Any
    hearts_remaining: int


class LessonCompleteRequest(BaseModel):
    lesson_id: int
    mistakes: int
    hearts_lost: int


class LessonCompleteResponse(BaseModel):
    xp_earned: int
    xp_total: int
    streak_count: int
    crowns: int
    is_skill_completed: bool
    newly_unlocked_skill_ids: List[int] = []
    leveled_up_achievement: Optional[str] = None


# ---------- Hearts ----------

class HeartsRefillResponse(BaseModel):
    hearts: int
    gems: int
    message: str


# ---------- Leaderboard / profile ----------

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    display_name: str
    avatar_color: str
    xp_total: int
    is_current_user: bool


class AchievementOut(BaseModel):
    code: str
    title: str
    description: str
    icon: str
    earned: bool
    earned_at: Optional[datetime]

    class Config:
        from_attributes = True


class ProfileResponse(BaseModel):
    user: UserOut
    total_lessons_completed: int
    skills_completed: int
    achievements: List[AchievementOut]
