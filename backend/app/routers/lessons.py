"""
Lesson player endpoints:
  GET  /api/lessons/{lesson_id}          -> exercises (answers withheld)
  POST /api/exercises/{exercise_id}/check -> immediate correct/incorrect + heart loss
  POST /api/lessons/complete              -> XP, streak, crowns, unlock next skill, achievements
"""
import json
from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api", tags=["lessons"])


def _normalize(value):
    """Loose normalization so answer-checking isn't fussy about case/whitespace."""
    if isinstance(value, str):
        return value.strip().lower()
    if isinstance(value, list):
        return [_normalize(v) for v in value]
    if isinstance(value, dict):
        return {str(k).strip().lower(): _normalize(v) for k, v in value.items()}
    return value


@router.get("/lessons/{lesson_id}", response_model=schemas.LessonDetail)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = (
        db.query(models.Lesson)
        .options(joinedload(models.Lesson.exercises), joinedload(models.Lesson.skill))
        .filter(models.Lesson.id == lesson_id)
        .first()
    )
    if not lesson:
        raise HTTPException(404, "Lesson not found")

    exercises = []
    for ex in sorted(lesson.exercises, key=lambda e: e.order_index):
        exercises.append(schemas.ExerciseOut(
            id=ex.id, order_index=ex.order_index, type=ex.type,
            prompt=ex.prompt, data=json.loads(ex.data_json),
        ))

    return schemas.LessonDetail(
        id=lesson.id, skill_id=lesson.skill_id, skill_title=lesson.skill.title,
        order_index=lesson.order_index, xp_reward=lesson.xp_reward, exercises=exercises,
    )


@router.post("/exercises/{exercise_id}/check", response_model=schemas.AnswerResult)
def check_answer(exercise_id: int, payload: schemas.AnswerSubmit, user_id: int = 1, db: Session = Depends(get_db)):
    exercise = db.query(models.Exercise).filter(models.Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(404, "Exercise not found")

    correct_answer = json.loads(exercise.correct_answer_json)
    is_correct = _normalize(payload.answer) == _normalize(correct_answer)

    hearts_remaining = None
    if not is_correct:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user:
            user.hearts = max(0, user.hearts - 1)
            user.last_heart_lost_at = datetime.utcnow()
            db.commit()
            db.refresh(user)
            hearts_remaining = user.hearts
    else:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        hearts_remaining = user.hearts if user else None

    return schemas.AnswerResult(
        correct=is_correct, correct_answer=correct_answer,
        hearts_remaining=hearts_remaining if hearts_remaining is not None else 0,
    )


ACHIEVEMENT_CHECKS = {
    "first_lesson": lambda db, user: db.query(models.LessonCompletion).filter_by(user_id=user.id).count() >= 1,
    "streak_3": lambda db, user: user.streak_count >= 3,
    "streak_7": lambda db, user: user.streak_count >= 7,
    "xp_100": lambda db, user: user.xp_total >= 100,
    "skill_master": lambda db, user: db.query(models.UserSkillProgress).filter_by(user_id=user.id, is_completed=True).count() >= 1,
}


def _award_achievements(db: Session, user: models.User, zero_mistakes: bool):
    newly = []
    earned_codes = {
        ua.achievement.code
        for ua in db.query(models.UserAchievement).filter_by(user_id=user.id).options(joinedload(models.UserAchievement.achievement))
    }
    checks = dict(ACHIEVEMENT_CHECKS)
    if zero_mistakes:
        checks["perfectionist"] = lambda db, user: True

    for code, check in checks.items():
        if code in earned_codes:
            continue
        if check(db, user):
            ach = db.query(models.Achievement).filter_by(code=code).first()
            if ach:
                db.add(models.UserAchievement(user_id=user.id, achievement_id=ach.id))
                newly.append(ach.title)
    return newly


@router.post("/lessons/complete", response_model=schemas.LessonCompleteResponse)
def complete_lesson(payload: schemas.LessonCompleteRequest, user_id: int = 1, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == payload.lesson_id).first()
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    accuracy = 1.0
    total_ex = len(lesson.exercises) or 1
    accuracy = max(0.0, (total_ex - payload.mistakes) / total_ex)

    xp_earned = lesson.xp_reward + (5 if payload.mistakes == 0 else 0)  # small perfect bonus

    # ---- streak logic ----
    today = date.today()
    if user.last_activity_date == today:
        pass  # already active today, streak unchanged
    elif user.last_activity_date == today - timedelta(days=1):
        user.streak_count += 1
    else:
        user.streak_count = 1
    user.longest_streak = max(user.longest_streak, user.streak_count)
    if user.last_activity_date != today:
        user.xp_today = 0
    user.last_activity_date = today

    user.xp_total += xp_earned
    user.xp_today += xp_earned

    db.add(models.LessonCompletion(
        user_id=user.id, lesson_id=lesson.id, xp_earned=xp_earned,
        hearts_lost=payload.hearts_lost, mistakes=payload.mistakes, accuracy=accuracy,
    ))

    # ---- crown / skill progress ----
    prog = db.query(models.UserSkillProgress).filter_by(user_id=user.id, skill_id=lesson.skill_id).first()
    if not prog:
        prog = models.UserSkillProgress(user_id=user.id, skill_id=lesson.skill_id, is_unlocked=True, crowns=0)
        db.add(prog)
        db.flush()

    skill = lesson.skill
    if prog.crowns <= lesson.order_index:
        prog.crowns = min(skill.max_crowns, lesson.order_index + 1)
    prog.last_practiced_at = datetime.utcnow()
    is_skill_completed = prog.crowns >= skill.max_crowns
    prog.is_completed = is_skill_completed

    # ---- unlock next skill in course order if this one just got completed ----
    newly_unlocked_ids = []
    if is_skill_completed:
        unit = skill.unit
        siblings = sorted(unit.skills, key=lambda s: s.order_index)
        idx = next((i for i, s in enumerate(siblings) if s.id == skill.id), None)
        next_skill = None
        if idx is not None and idx + 1 < len(siblings):
            next_skill = siblings[idx + 1]
        else:
            # move to first skill of next unit
            all_units = sorted(unit.course.units, key=lambda u: u.order_index)
            u_idx = next((i for i, u in enumerate(all_units) if u.id == unit.id), None)
            if u_idx is not None and u_idx + 1 < len(all_units):
                next_unit_skills = sorted(all_units[u_idx + 1].skills, key=lambda s: s.order_index)
                if next_unit_skills:
                    next_skill = next_unit_skills[0]
        if next_skill:
            next_prog = db.query(models.UserSkillProgress).filter_by(user_id=user.id, skill_id=next_skill.id).first()
            if not next_prog:
                next_prog = models.UserSkillProgress(user_id=user.id, skill_id=next_skill.id, is_unlocked=True, crowns=0)
                db.add(next_prog)
            elif not next_prog.is_unlocked:
                next_prog.is_unlocked = True
            newly_unlocked_ids.append(next_skill.id)

    db.commit()
    db.refresh(user)

    newly_achievements = _award_achievements(db, user, zero_mistakes=(payload.mistakes == 0))
    db.commit()

    return schemas.LessonCompleteResponse(
        xp_earned=xp_earned, xp_total=user.xp_total, streak_count=user.streak_count,
        crowns=prog.crowns, is_skill_completed=is_skill_completed,
        newly_unlocked_skill_ids=newly_unlocked_ids,
        leveled_up_achievement=newly_achievements[0] if newly_achievements else None,
    )
