"""GET /api/path — the home skill tree, merged with the user's progress."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api", tags=["path"])


@router.get("/path", response_model=schemas.PathResponse)
def get_path(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    course = (
        db.query(models.Course)
        .options(
            joinedload(models.Course.units)
            .joinedload(models.Unit.skills)
            .joinedload(models.Skill.lessons)
        )
        .first()
    )
    if not course:
        raise HTTPException(404, "No course seeded")

    progress_by_skill = {
        p.skill_id: p
        for p in db.query(models.UserSkillProgress).filter(models.UserSkillProgress.user_id == user_id)
    }

    # Build response manually so we can merge in per-user progress + compute
    # unlock state for skills the user has never touched (first skill of the
    # whole course is always unlocked; every other skill unlocks once the
    # previous skill in course order is completed).
    all_skills_ordered = []
    for unit in sorted(course.units, key=lambda u: u.order_index):
        for skill in sorted(unit.skills, key=lambda s: s.order_index):
            all_skills_ordered.append(skill)

    unit_outs = []
    prev_skill_completed = True  # first skill always unlocked
    for unit in sorted(course.units, key=lambda u: u.order_index):
        skill_outs = []
        for skill in sorted(unit.skills, key=lambda s: s.order_index):
            prog = progress_by_skill.get(skill.id)
            crowns = prog.crowns if prog else 0
            is_completed = prog.is_completed if prog else False
            # a skill is unlocked if explicitly marked so, OR the previous skill was completed
            is_unlocked = (prog.is_unlocked if prog else False) or prev_skill_completed

            skill_outs.append(schemas.SkillOut(
                id=skill.id, title=skill.title, icon=skill.icon,
                order_index=skill.order_index, max_crowns=skill.max_crowns,
                crowns=crowns, is_unlocked=is_unlocked, is_completed=is_completed,
                lessons=[schemas.LessonBrief.model_validate(l) for l in skill.lessons],
            ))
            prev_skill_completed = is_completed

        unit_outs.append(schemas.UnitOut(
            id=unit.id, title=unit.title, description=unit.description,
            color_hex=unit.color_hex, order_index=unit.order_index, skills=skill_outs,
        ))

    course_out = schemas.CourseOut(
        id=course.id, name=course.name, language_code=course.language_code,
        flag_emoji=course.flag_emoji, units=unit_outs,
    )

    return schemas.PathResponse(course=course_out, user=schemas.UserOut.model_validate(user))
