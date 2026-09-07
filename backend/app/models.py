"""
Database schema (SQLAlchemy models).

Design overview
----------------
Course -> Unit -> Skill -> Lesson -> Exercise   (content hierarchy, seeded)
User -> UserSkillProgress (per-skill unlock/crown state, one row per user+skill)
User -> LessonCompletion (history log, one row per finished lesson attempt)
User -> UserAchievement (bonus: badges earned)

A "Skill" is a node on the path (e.g. "Basics 1"). A Skill has several
Lessons (Duolingo calls these "levels", shown as crowns filling up). Each
Lesson is a sequence of Exercises of varying types.
"""
from sqlalchemy import (
    Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Date, Text, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=False)
    avatar_color = Column(String, default="#58CC02")

    # Gamification state
    xp_total = Column(Integer, default=0)
    xp_today = Column(Integer, default=0)
    daily_goal_xp = Column(Integer, default=20)

    streak_count = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(Date, nullable=True)  # date of last completed lesson

    hearts = Column(Integer, default=5)
    max_hearts = Column(Integer, default=5)
    last_heart_lost_at = Column(DateTime, nullable=True)  # for regen timer

    gems = Column(Integer, default=500)  # mocked currency

    created_at = Column(DateTime, server_default=func.now())

    progress = relationship("UserSkillProgress", back_populates="user", cascade="all, delete-orphan")
    completions = relationship("LessonCompletion", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)          # e.g. "Spanish"
    language_code = Column(String, nullable=False)  # e.g. "es"
    from_language = Column(String, default="en")
    flag_emoji = Column(String, default="🇪🇸")

    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan", order_by="Unit.order_index")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String, nullable=False)          # "Unit 1: Greetings"
    description = Column(String, default="")
    color_hex = Column(String, default="#58CC02")

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan", order_by="Skill.order_index")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String, nullable=False)           # "Basics 1"
    icon = Column(String, default="⭐")
    max_crowns = Column(Integer, default=3)          # number of lessons = crown levels

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan", order_by="Lesson.order_index")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    order_index = Column(Integer, nullable=False)     # which crown level (0,1,2..)
    xp_reward = Column(Integer, default=10)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan", order_by="Exercise.order_index")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    type = Column(String, nullable=False)
    # one of: "multiple_choice" | "translate" | "match_pairs" | "fill_blank" | "type_answer"

    prompt = Column(String, nullable=False)
    # JSON blobs (stored as TEXT, encoded/decoded by the app layer) so each
    # exercise type can carry its own shape without extra tables.
    data_json = Column(Text, nullable=False)          # options/word bank/pairs etc.
    correct_answer_json = Column(Text, nullable=False)  # correct answer(s)

    lesson = relationship("Lesson", back_populates="exercises")


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"
    __table_args__ = (UniqueConstraint("user_id", "skill_id", name="uq_user_skill"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)

    is_unlocked = Column(Boolean, default=False)
    crowns = Column(Integer, default=0)         # 0..skill.max_crowns
    is_completed = Column(Boolean, default=False)  # crowns == max_crowns
    last_practiced_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="progress")
    skill = relationship("Skill")


class LessonCompletion(Base):
    __tablename__ = "lesson_completions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)

    xp_earned = Column(Integer, default=0)
    hearts_lost = Column(Integer, default=0)
    mistakes = Column(Integer, default=0)
    accuracy = Column(Float, default=1.0)
    completed_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="completions")
    lesson = relationship("Lesson")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, default="")
    icon = Column(String, default="🏆")


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    __table_args__ = (UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    earned_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")
