from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import SessionLocal


router = APIRouter(prefix="/api")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def apply_heart_regeneration(user: models.User) -> bool:
    """
    Regenerate one heart every 30 minutes, up to max_hearts.

    This is lazy regeneration:
    we calculate the available hearts whenever the user is requested
    instead of running a background job every 30 minutes.
    """

    if user.hearts >= user.max_hearts:
        return False

    if not user.last_heart_lost_at:
        return False

    now = datetime.utcnow()

    elapsed = now - user.last_heart_lost_at
    intervals = int(elapsed.total_seconds() // (30 * 60))

    if intervals <= 0:
        return False

    old_hearts = user.hearts

    user.hearts = min(
        user.max_hearts,
        user.hearts + intervals,
    )

    if user.hearts >= user.max_hearts:
        user.last_heart_lost_at = None
    else:
        user.last_heart_lost_at = (
            user.last_heart_lost_at
            + timedelta(minutes=30 * intervals)
        )

    return user.hearts != old_hearts


# ============================================================
# USER
# ============================================================

@router.get(
    "/users/{user_id}",
    response_model=schemas.UserOut,
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    changed = apply_heart_regeneration(user)

    if changed:
        db.commit()
        db.refresh(user)

    return user


# ============================================================
# HEART REFILL
# ============================================================

@router.post(
    "/users/{user_id}/hearts/refill",
    response_model=schemas.UserOut,
)
def refill_hearts(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # First apply any hearts that naturally regenerated.
    apply_heart_regeneration(user)

    if user.hearts >= user.max_hearts:
        db.commit()
        db.refresh(user)
        return user

    # Duolingo-style mocked refill cost.
    REFILL_COST = 350

    if user.gems >= REFILL_COST:
        user.gems -= REFILL_COST
        user.hearts = user.max_hearts
        user.last_heart_lost_at = None

        db.commit()
        db.refresh(user)

        return user

    raise HTTPException(
        status_code=400,
        detail="Not enough gems to refill hearts.",
    )


# ============================================================
# LEADERBOARD
# ============================================================

@router.get(
    "/leaderboard",
    response_model=list[schemas.LeaderboardEntry],
)
def leaderboard(
    user_id: int = 1,
    db: Session = Depends(get_db),
):
    """
    Return the LIVE leaderboard.

    Every leaderboard request reads the current users and their
    persisted XP directly from SQLite.

    Ranking:
        1. Higher XP comes first.
        2. User ID is used as a deterministic tie-breaker.

    Therefore, when the current learner completes a lesson and
    receives XP, their leaderboard position changes automatically.
    """

    current_user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not current_user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    users = (
        db.query(models.User)
        .order_by(
            models.User.xp_total.desc(),
            models.User.id.asc(),
        )
        .all()
    )

    leaderboard_entries = []

    for index, user in enumerate(users):
        leaderboard_entries.append(
            schemas.LeaderboardEntry(
                rank=index + 1,
                user_id=user.id,
                display_name=user.display_name,
                avatar_color=user.avatar_color,
                xp_total=user.xp_total,
                is_current_user=(
                    user.id == current_user.id
                ),
            )
        )

    return leaderboard_entries


# ============================================================
# PROFILE
# ============================================================

@router.get(
    "/users/{user_id}/profile",
)
def get_profile(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    apply_heart_regeneration(user)

    # --------------------------------------------------------
    # Completed skills
    # --------------------------------------------------------

    completed_skills = (
        db.query(models.UserSkillProgress)
        .filter(
            models.UserSkillProgress.user_id == user_id,
            models.UserSkillProgress.is_completed.is_(True),
        )
        .count()
    )

    # --------------------------------------------------------
    # Lessons completed
    # --------------------------------------------------------

    lessons_completed = (
        db.query(models.LessonCompletion)
        .filter(
            models.LessonCompletion.user_id == user_id,
        )
        .count()
    )

    # --------------------------------------------------------
    # Average accuracy
    # --------------------------------------------------------

    completions = (
        db.query(models.LessonCompletion)
        .filter(
            models.LessonCompletion.user_id == user_id,
        )
        .all()
    )

    if completions:
        average_accuracy = round(
            sum(
                completion.accuracy
                for completion in completions
            )
            / len(completions)
            * 100,
            1,
        )
    else:
        average_accuracy = 0.0

    # --------------------------------------------------------
    # Achievements
    # --------------------------------------------------------

    achievements = (
        db.query(models.Achievement)
        .join(
            models.UserAchievement,
            models.UserAchievement.achievement_id
            == models.Achievement.id,
        )
        .filter(
            models.UserAchievement.user_id == user_id,
        )
        .all()
    )

    achievement_data = [
        {
            "id": achievement.id,
            "code": achievement.code,
            "title": achievement.title,
            "description": achievement.description,
            "icon": achievement.icon,
        }
        for achievement in achievements
    ]

    db.commit()
    db.refresh(user)

    return {
        "user": user,
        "stats": {
            "streak": user.streak_count,
            "longest_streak": user.longest_streak,
            "xp_total": user.xp_total,
            "xp_today": user.xp_today,
            "daily_goal_xp": user.daily_goal_xp,
            "completed_skills": completed_skills,
            "lessons_completed": lessons_completed,
            "average_accuracy": average_accuracy,
        },
        "achievements": achievement_data,
    }