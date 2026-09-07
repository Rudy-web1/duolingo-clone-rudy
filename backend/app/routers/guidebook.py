"""
Guidebook / teaching content endpoints.

GET /api/guidebook/{skill_id}

The guidebook uses the existing seeded skills, lessons and exercises.
No new database table is required.
"""

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from .. import models
from ..database import get_db


router = APIRouter(prefix="/api", tags=["guidebook"])


GUIDEBOOK_CONTENT = {
    "Basics 1": {
        "subtitle": "Learn some essential Spanish words",
        "intro": (
            "Start with simple words for people, animals, food, "
            "and everyday things."
        ),
        "cards": [
            {
                "type": "vocabulary",
                "spanish": "la mujer",
                "english": "the woman",
                "tip": "la is commonly used with feminine nouns.",
            },
            {
                "type": "vocabulary",
                "spanish": "el niño",
                "english": "the boy",
                "tip": "el is commonly used with masculine nouns.",
            },
            {
                "type": "vocabulary",
                "spanish": "la niña",
                "english": "the girl",
                "tip": "la niña means 'the girl'.",
            },
            {
                "type": "vocabulary",
                "spanish": "el gato",
                "english": "the cat",
                "tip": "el gato means 'the cat'.",
            },
            {
                "type": "vocabulary",
                "spanish": "el perro",
                "english": "the dog",
                "tip": "el perro means 'the dog'.",
            },
            {
                "type": "vocabulary",
                "spanish": "agua",
                "english": "water",
                "tip": "agua means 'water'.",
            },
            {
                "type": "sentence",
                "spanish": "Yo como pan",
                "english": "I eat bread",
                "tip": "Yo means 'I' and como means 'eat'.",
            },
        ],
    },

    "Basics 2": {
        "subtitle": "Build your basic Spanish vocabulary",
        "intro": "Learn more everyday Spanish words and simple expressions.",
        "cards": [],
    },

    "Greetings": {
        "subtitle": "Say hello and goodbye in Spanish",
        "intro": (
            "Learn common greetings and expressions you can use "
            "when meeting people."
        ),
        "cards": [
            {
                "type": "vocabulary",
                "spanish": "hola",
                "english": "hello",
                "tip": "Hola is a common way to say hello.",
            },
            {
                "type": "vocabulary",
                "spanish": "Buenos días",
                "english": "Good morning",
                "tip": "Use Buenos días in the morning.",
            },
            {
                "type": "vocabulary",
                "spanish": "Buenas tardes",
                "english": "Good afternoon",
                "tip": "Use Buenas tardes during the afternoon.",
            },
            {
                "type": "vocabulary",
                "spanish": "adiós",
                "english": "goodbye",
                "tip": "Adiós is used when saying goodbye.",
            },
        ],
    },

    "Introductions": {
        "subtitle": "Introduce yourself in Spanish",
        "intro": (
            "Learn simple expressions for meeting someone and "
            "introducing yourself."
        ),
        "cards": [],
    },

    "Family": {
        "subtitle": "Talk about family",
        "intro": "Learn useful Spanish words for talking about family members.",
        "cards": [],
    },

    "People": {
        "subtitle": "Describe people",
        "intro": "Learn vocabulary for talking about people.",
        "cards": [],
    },

    "Descriptions": {
        "subtitle": "Describe people and things",
        "intro": "Learn words and expressions used to describe things.",
        "cards": [],
    },

    "Food": {
        "subtitle": "Learn food vocabulary",
        "intro": "Build your vocabulary for talking about food.",
        "cards": [],
    },

    "Drinks": {
        "subtitle": "Talk about drinks",
        "intro": "Learn useful Spanish words for drinks.",
        "cards": [],
    },

    "Restaurant": {
        "subtitle": "Spanish for restaurants",
        "intro": "Learn useful expressions for eating out.",
        "cards": [],
    },

    "Home": {
        "subtitle": "Talk about your home",
        "intro": "Learn vocabulary for rooms and things around the home.",
        "cards": [],
    },

    "Daily Routine": {
        "subtitle": "Talk about your day",
        "intro": "Learn Spanish vocabulary for everyday activities.",
        "cards": [],
    },

    "Time & Dates": {
        "subtitle": "Talk about time and dates",
        "intro": "Learn how to talk about time and dates.",
        "cards": [],
    },

    "Verbs: Present": {
        "subtitle": "Use common verbs",
        "intro": "Learn how Spanish verbs can be used in the present.",
        "cards": [],
    },

    "Common Verbs": {
        "subtitle": "Master useful Spanish verbs",
        "intro": "Practice some of the most useful verbs in Spanish.",
        "cards": [],
    },

    "Questions": {
        "subtitle": "Ask questions in Spanish",
        "intro": "Learn useful question words and sentence patterns.",
        "cards": [],
    },

    "Directions": {
        "subtitle": "Find your way around",
        "intro": "Learn Spanish vocabulary for directions and locations.",
        "cards": [],
    },

    "Transport": {
        "subtitle": "Talk about transportation",
        "intro": "Learn words for getting around.",
        "cards": [],
    },

    "Hotel": {
        "subtitle": "Spanish for hotels",
        "intro": "Learn useful expressions for staying at a hotel.",
        "cards": [],
    },

    "Shopping": {
        "subtitle": "Spanish for shopping",
        "intro": "Learn vocabulary and expressions used while shopping.",
        "cards": [],
    },

    "Work": {
        "subtitle": "Talk about work",
        "intro": "Learn useful Spanish vocabulary related to work.",
        "cards": [],
    },

    "Social Life": {
        "subtitle": "Talk about social activities",
        "intro": "Learn useful expressions for conversations and social situations.",
        "cards": [],
    },

    "Past Tense": {
        "subtitle": "Talk about the past",
        "intro": "Learn how to describe things that already happened.",
        "cards": [],
    },

    "Future": {
        "subtitle": "Talk about the future",
        "intro": "Learn useful ways to talk about future actions.",
        "cards": [],
    },

    "Conversation": {
        "subtitle": "Put your Spanish together",
        "intro": "Practice combining vocabulary and grammar in conversation.",
        "cards": [],
    },

    "Review": {
        "subtitle": "Review what you have learned",
        "intro": "Bring together vocabulary and skills from previous units.",
        "cards": [],
    },
}


def _build_fallback_cards(skill):
    """
    Create simple teaching cards from existing exercises when
    manually curated cards are not available.
    """

    cards = []

    lessons = sorted(
        skill.lessons,
        key=lambda lesson: lesson.order_index,
    )

    seen = set()

    for lesson in lessons:
        exercises = sorted(
            lesson.exercises,
            key=lambda exercise: exercise.order_index,
        )

        for exercise in exercises:
            try:
                correct = json.loads(exercise.correct_answer_json)
            except Exception:
                correct = None

            key = (
                exercise.prompt,
                json.dumps(
                    correct,
                    sort_keys=True,
                    ensure_ascii=False,
                )
                if correct is not None
                else "",
            )

            if key in seen:
                continue

            seen.add(key)

            if isinstance(correct, str) and correct.strip():
                cards.append(
                    {
                        "type": "example",
                        "spanish": exercise.prompt,
                        "english": correct,
                        "tip": "Practice this expression in the lesson.",
                    }
                )

            if len(cards) >= 8:
                return cards

    return cards


@router.get("/guidebook/{skill_id}")
def get_guidebook(
    skill_id: int,
    user_id: int = 1,
    db: Session = Depends(get_db),
):
    """
    Return teaching material and current progression for a skill.

    The next lesson is determined by the user's current crown count:

        crowns 0 -> lesson order_index 0
        crowns 1 -> lesson order_index 1
        crowns 2 -> lesson order_index 2

    This matches the progression logic used by SkillNode.
    """

    skill = (
        db.query(models.Skill)
        .options(
            joinedload(models.Skill.lessons)
            .joinedload(models.Lesson.exercises)
        )
        .filter(models.Skill.id == skill_id)
        .first()
    )

    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found",
        )

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

    # -------------------------------------------------------------
    # Current skill progress
    # -------------------------------------------------------------

    progress = (
        db.query(models.UserSkillProgress)
        .filter(
            models.UserSkillProgress.user_id == user_id,
            models.UserSkillProgress.skill_id == skill_id,
        )
        .first()
    )

    crowns = progress.crowns if progress else 0
    is_unlocked = (
        progress.is_unlocked
        if progress
        else False
    )
    is_completed = (
        progress.is_completed
        if progress
        else False
    )

    # -------------------------------------------------------------
    # Teaching content
    # -------------------------------------------------------------

    content = GUIDEBOOK_CONTENT.get(skill.title)

    if content:
        cards = content.get("cards", [])
        subtitle = content.get(
            "subtitle",
            skill.title,
        )
        intro = content.get(
            "intro",
            "",
        )
    else:
        cards = []
        subtitle = skill.title
        intro = "Learn the key ideas from this skill."

    if not cards:
        cards = _build_fallback_cards(skill)

    # -------------------------------------------------------------
    # Lessons
    # -------------------------------------------------------------

    lessons = sorted(
        skill.lessons,
        key=lambda lesson: lesson.order_index,
    )

    lesson_data = [
        {
            "id": lesson.id,
            "order_index": lesson.order_index,
            "xp_reward": lesson.xp_reward,
        }
        for lesson in lessons
    ]

    # -------------------------------------------------------------
    # Determine the NEXT lesson.
    #
    # This is the critical progression fix.
    #
    # crown 0 -> lesson order 0
    # crown 1 -> lesson order 1
    # crown 2 -> lesson order 2
    # -------------------------------------------------------------

    next_lesson = next(
        (
            lesson
            for lesson in lessons
            if lesson.order_index == crowns
        ),
        None,
    )

    # If the skill is completely mastered, keep the first lesson
    # available for review instead of returning nothing.
    if next_lesson is None and lessons:
        next_lesson = lessons[0]

    return {
        "skill": {
            "id": skill.id,
            "title": skill.title,
            "icon": skill.icon,
            "max_crowns": skill.max_crowns,
        },
        "subtitle": subtitle,
        "intro": intro,
        "cards": cards,
        "lessons": lesson_data,
        "progress": {
            "crowns": crowns,
            "is_unlocked": is_unlocked,
            "is_completed": is_completed,
        },
        "next_lesson_id": (
            next_lesson.id
            if next_lesson
            else None
        ),
    }