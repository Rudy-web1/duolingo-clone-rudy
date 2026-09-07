"""
Spanish course seed data.

Creates a larger, progressive Spanish learning path while
keeping the existing SQLite + SQLAlchemy architecture.
"""

import json
from datetime import date, timedelta

from .database import SessionLocal, engine, Base
from . import models


def j(obj):
    return json.dumps(obj)


# =========================================================
# EXERCISE BANK
# =========================================================

EXERCISE_BANK = {

    # -----------------------------------------------------
    # FOUNDATIONS
    # -----------------------------------------------------

    "Basics 1": [
        (
            "multiple_choice",
            "Which one means 'the woman'?",
            {"options": ["el hombre", "la mujer", "el niño", "la casa"]},
            "la mujer",
        ),
        (
            "translate",
            "Translate: 'I eat bread'",
            {"word_bank": ["Yo", "como", "pan", "agua", "el", "casa"]},
            ["Yo", "como", "pan"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'water'",
            {},
            "agua",
        ),
        (
            "match_pairs",
            "Match the pairs",
            {
                "pairs": [
                    ["el niño", "the boy"],
                    ["la niña", "the girl"],
                    ["el gato", "the cat"],
                    ["el perro", "the dog"],
                ]
            },
            {
                "el niño": "the boy",
                "la niña": "the girl",
                "el gato": "the cat",
                "el perro": "the dog",
            },
        ),
        (
            "fill_blank",
            "Yo ___ una manzana. (eat)",
            {"options": ["como", "comes", "come", "comen"]},
            "como",
        ),
    ],

    "Basics 2": [
        (
            "multiple_choice",
            "Which one means 'good morning'?",
            {
                "options": [
                    "buenas noches",
                    "buenos días",
                    "buenas tardes",
                    "hola amigo",
                ]
            },
            "buenos días",
        ),
        (
            "translate",
            "Translate: 'She drinks water'",
            {
                "word_bank": [
                    "Ella",
                    "bebe",
                    "agua",
                    "yo",
                    "pan",
                    "el",
                ]
            },
            ["Ella", "bebe", "agua"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'friend'",
            {},
            "amigo",
        ),
        (
            "fill_blank",
            "Buenas ___, ¿cómo estás? (afternoon)",
            {
                "options": [
                    "días",
                    "noches",
                    "tardes",
                    "semana",
                ]
            },
            "tardes",
        ),
    ],

    "Greetings": [
        (
            "multiple_choice",
            "How do you say 'hello'?",
            {
                "options": [
                    "hola",
                    "adiós",
                    "gracias",
                    "perdón",
                ]
            },
            "hola",
        ),
        (
            "translate",
            "Translate: 'Good afternoon'",
            {
                "word_bank": [
                    "Buenas",
                    "tardes",
                    "Buenos",
                    "días",
                    "hola",
                ]
            },
            ["Buenas", "tardes"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'goodbye'",
            {},
            "adiós",
        ),
        (
            "fill_blank",
            "___ días, ¿cómo estás?",
            {
                "options": [
                    "Buenos",
                    "Buenas",
                    "Hola",
                    "Adiós",
                ]
            },
            "Buenos",
        ),
    ],

    "Introductions": [
        (
            "multiple_choice",
            "What does 'Me llamo Ana' mean?",
            {
                "options": [
                    "My name is Ana",
                    "I live in Ana",
                    "I like Ana",
                    "Goodbye Ana",
                ]
            },
            "My name is Ana",
        ),
        (
            "translate",
            "Translate: 'My name is Carlos'",
            {
                "word_bank": [
                    "Me",
                    "llamo",
                    "Carlos",
                    "Soy",
                    "Ana",
                ]
            },
            ["Me", "llamo", "Carlos"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'I am Maria'",
            {},
            "soy Maria",
        ),
        (
            "fill_blank",
            "Me ___ Luis.",
            {
                "options": [
                    "llamo",
                    "llamas",
                    "llama",
                    "llamamos",
                ]
            },
            "llamo",
        ),
    ],

    # -----------------------------------------------------
    # PEOPLE
    # -----------------------------------------------------

    "Family": [
        (
            "multiple_choice",
            "Which one means 'mother'?",
            {
                "options": [
                    "padre",
                    "madre",
                    "hermano",
                    "hijo",
                ]
            },
            "madre",
        ),
        (
            "match_pairs",
            "Match the family members",
            {
                "pairs": [
                    ["padre", "father"],
                    ["madre", "mother"],
                    ["hermano", "brother"],
                    ["hermana", "sister"],
                ]
            },
            {
                "padre": "father",
                "madre": "mother",
                "hermano": "brother",
                "hermana": "sister",
            },
        ),
        (
            "type_answer",
            "Type in Spanish: 'son'",
            {},
            "hijo",
        ),
        (
            "translate",
            "Translate: 'My brother eats'",
            {
                "word_bank": [
                    "Mi",
                    "hermano",
                    "come",
                    "hermana",
                    "bebe",
                    "el",
                ]
            },
            ["Mi", "hermano", "come"],
        ),
    ],

    "People": [
        (
            "multiple_choice",
            "Which one means 'friend'?",
            {
                "options": [
                    "amigo",
                    "padre",
                    "niño",
                    "maestro",
                ]
            },
            "amigo",
        ),
        (
            "translate",
            "Translate: 'The boy is happy'",
            {
                "word_bank": [
                    "El",
                    "niño",
                    "está",
                    "feliz",
                    "la",
                    "casa",
                ]
            },
            ["El", "niño", "está", "feliz"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'girl'",
            {},
            "niña",
        ),
        (
            "fill_blank",
            "Ella es mi ___. (friend)",
            {
                "options": [
                    "amiga",
                    "amigo",
                    "hermano",
                    "madre",
                ]
            },
            "amiga",
        ),
    ],

    "Descriptions": [
        (
            "multiple_choice",
            "Which means 'tall'?",
            {
                "options": [
                    "alto",
                    "bajo",
                    "feliz",
                    "joven",
                ]
            },
            "alto",
        ),
        (
            "translate",
            "Translate: 'She is young'",
            {
                "word_bank": [
                    "Ella",
                    "es",
                    "joven",
                    "él",
                    "alto",
                ]
            },
            ["Ella", "es", "joven"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'happy'",
            {},
            "feliz",
        ),
        (
            "fill_blank",
            "Mi hermano es ___. (tall)",
            {
                "options": [
                    "alto",
                    "alta",
                    "altos",
                    "bajo",
                ]
            },
            "alto",
        ),
    ],

    # -----------------------------------------------------
    # FOOD
    # -----------------------------------------------------

    "Food": [
        (
            "multiple_choice",
            "Which one means 'the apple'?",
            {
                "options": [
                    "la manzana",
                    "el pan",
                    "la leche",
                    "el huevo",
                ]
            },
            "la manzana",
        ),
        (
            "translate",
            "Translate: 'The bread is good'",
            {
                "word_bank": [
                    "El",
                    "pan",
                    "es",
                    "bueno",
                    "malo",
                    "agua",
                ]
            },
            ["El", "pan", "es", "bueno"],
        ),
        (
            "fill_blank",
            "Yo bebo ___. (milk)",
            {
                "options": [
                    "leche",
                    "pan",
                    "queso",
                    "huevo",
                ]
            },
            "leche",
        ),
        (
            "type_answer",
            "Type in Spanish: 'egg'",
            {},
            "huevo",
        ),
    ],

    "Drinks": [
        (
            "multiple_choice",
            "Which one means 'water'?",
            {
                "options": [
                    "agua",
                    "leche",
                    "café",
                    "jugo",
                ]
            },
            "agua",
        ),
        (
            "translate",
            "Translate: 'I drink coffee'",
            {
                "word_bank": [
                    "Yo",
                    "bebo",
                    "café",
                    "agua",
                    "como",
                ]
            },
            ["Yo", "bebo", "café"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'milk'",
            {},
            "leche",
        ),
        (
            "fill_blank",
            "Ella bebe ___. (juice)",
            {
                "options": [
                    "jugo",
                    "agua",
                    "café",
                    "pan",
                ]
            },
            "jugo",
        ),
    ],

    "Restaurant": [
        (
            "multiple_choice",
            "How do you say 'menu'?",
            {
                "options": [
                    "menú",
                    "mesa",
                    "cuenta",
                    "plato",
                ]
            },
            "menú",
        ),
        (
            "translate",
            "Translate: 'The bill, please'",
            {
                "word_bank": [
                    "La",
                    "cuenta",
                    "por",
                    "favor",
                    "gracias",
                ]
            },
            ["La", "cuenta", "por", "favor"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'please'",
            {},
            "por favor",
        ),
        (
            "fill_blank",
            "Quiero una ___. (table)",
            {
                "options": [
                    "mesa",
                    "cuenta",
                    "casa",
                    "comida",
                ]
            },
            "mesa",
        ),
    ],

    # -----------------------------------------------------
    # DAILY LIFE
    # -----------------------------------------------------

    "Home": [
        (
            "multiple_choice",
            "Which one means 'house'?",
            {
                "options": [
                    "casa",
                    "mesa",
                    "puerta",
                    "calle",
                ]
            },
            "casa",
        ),
        (
            "translate",
            "Translate: 'My house is big'",
            {
                "word_bank": [
                    "Mi",
                    "casa",
                    "es",
                    "grande",
                    "mi",
                    "pequeña",
                ]
            },
            ["Mi", "casa", "es", "grande"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'door'",
            {},
            "puerta",
        ),
        (
            "fill_blank",
            "La ___ es pequeña. (house)",
            {
                "options": [
                    "casa",
                    "mesa",
                    "puerta",
                    "calle",
                ]
            },
            "casa",
        ),
    ],

    "Daily Routine": [
        (
            "multiple_choice",
            "What does 'mañana' mean?",
            {
                "options": [
                    "morning",
                    "night",
                    "week",
                    "month",
                ]
            },
            "morning",
        ),
        (
            "translate",
            "Translate: 'I work every day'",
            {
                "word_bank": [
                    "Yo",
                    "trabajo",
                    "cada",
                    "día",
                    "noche",
                    "como",
                ]
            },
            ["Yo", "trabajo", "cada", "día"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'today'",
            {},
            "hoy",
        ),
        (
            "fill_blank",
            "Yo ___ a las ocho. (work)",
            {
                "options": [
                    "trabajo",
                    "trabajas",
                    "trabaja",
                    "trabajan",
                ]
            },
            "trabajo",
        ),
    ],

    "Time & Dates": [
        (
            "multiple_choice",
            "Which one means 'today'?",
            {
                "options": [
                    "hoy",
                    "mañana",
                    "ayer",
                    "ahora",
                ]
            },
            "hoy",
        ),
        (
            "translate",
            "Translate: 'See you tomorrow'",
            {
                "word_bank": [
                    "Hasta",
                    "mañana",
                    "hoy",
                    "adiós",
                    "luego",
                ]
            },
            ["Hasta", "mañana"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'yesterday'",
            {},
            "ayer",
        ),
        (
            "fill_blank",
            "Nos vemos ___. (tomorrow)",
            {
                "options": [
                    "mañana",
                    "ayer",
                    "hoy",
                    "nunca",
                ]
            },
            "mañana",
        ),
    ],

    # -----------------------------------------------------
    # VERBS
    # -----------------------------------------------------

    "Verbs: Present": [
        (
            "fill_blank",
            "Yo ___ español. (speak)",
            {
                "options": [
                    "hablo",
                    "hablas",
                    "habla",
                    "hablan",
                ]
            },
            "hablo",
        ),
        (
            "multiple_choice",
            "Which means 'they run'?",
            {
                "options": [
                    "yo corro",
                    "ellos corren",
                    "tú corres",
                    "ella corre",
                ]
            },
            "ellos corren",
        ),
        (
            "type_answer",
            "Type in Spanish: 'I live' (vivir)",
            {},
            "vivo",
        ),
        (
            "translate",
            "Translate: 'We read books'",
            {
                "word_bank": [
                    "Nosotros",
                    "leemos",
                    "libros",
                    "libro",
                    "leer",
                    "el",
                ]
            },
            ["Nosotros", "leemos", "libros"],
        ),
    ],

    "Common Verbs": [
        (
            "multiple_choice",
            "Which means 'I have'?",
            {
                "options": [
                    "tengo",
                    "tienes",
                    "tiene",
                    "tenemos",
                ]
            },
            "tengo",
        ),
        (
            "translate",
            "Translate: 'I want water'",
            {
                "word_bank": [
                    "Yo",
                    "quiero",
                    "agua",
                    "tengo",
                    "pan",
                ]
            },
            ["Yo", "quiero", "agua"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'I need'",
            {},
            "necesito",
        ),
        (
            "fill_blank",
            "Yo ___ español. (learn)",
            {
                "options": [
                    "aprendo",
                    "aprendes",
                    "aprende",
                    "aprenden",
                ]
            },
            "aprendo",
        ),
    ],

    "Questions": [
        (
            "multiple_choice",
            "What does '¿Dónde?' mean?",
            {
                "options": [
                    "Where?",
                    "When?",
                    "Who?",
                    "Why?",
                ]
            },
            "Where?",
        ),
        (
            "translate",
            "Translate: 'Where do you live?'",
            {
                "word_bank": [
                    "¿Dónde",
                    "vives?",
                    "¿Qué",
                    "haces?",
                    "tú",
                ]
            },
            ["¿Dónde", "vives?"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'why'",
            {},
            "por qué",
        ),
        (
            "fill_blank",
            "¿___ estás? (Where)",
            {
                "options": [
                    "Dónde",
                    "Qué",
                    "Quién",
                    "Cuándo",
                ]
            },
            "Dónde",
        ),
    ],

    # -----------------------------------------------------
    # TRAVEL
    # -----------------------------------------------------

    "Directions": [
        (
            "multiple_choice",
            "Which means 'left'?",
            {
                "options": [
                    "izquierda",
                    "derecha",
                    "recto",
                    "cerca",
                ]
            },
            "izquierda",
        ),
        (
            "translate",
            "Translate: 'Turn right'",
            {
                "word_bank": [
                    "Gira",
                    "a",
                    "la",
                    "derecha",
                    "izquierda",
                ]
            },
            ["Gira", "a", "la", "derecha"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'street'",
            {},
            "calle",
        ),
        (
            "fill_blank",
            "Sigue todo ___. (straight)",
            {
                "options": [
                    "recto",
                    "derecha",
                    "izquierda",
                    "cerca",
                ]
            },
            "recto",
        ),
    ],

    "Transport": [
        (
            "multiple_choice",
            "Which means 'train'?",
            {
                "options": [
                    "tren",
                    "avión",
                    "coche",
                    "barco",
                ]
            },
            "tren",
        ),
        (
            "translate",
            "Translate: 'Where is the station?'",
            {
                "word_bank": [
                    "¿Dónde",
                    "está",
                    "la",
                    "estación?",
                    "calle",
                ]
            },
            ["¿Dónde", "está", "la", "estación?"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'airport'",
            {},
            "aeropuerto",
        ),
        (
            "fill_blank",
            "Voy en ___. (train)",
            {
                "options": [
                    "tren",
                    "casa",
                    "calle",
                    "mesa",
                ]
            },
            "tren",
        ),
    ],

    "Hotel": [
        (
            "multiple_choice",
            "Which means 'room'?",
            {
                "options": [
                    "habitación",
                    "mesa",
                    "puerta",
                    "comida",
                ]
            },
            "habitación",
        ),
        (
            "translate",
            "Translate: 'I have a reservation'",
            {
                "word_bank": [
                    "Tengo",
                    "una",
                    "reserva",
                    "mesa",
                    "habitación",
                ]
            },
            ["Tengo", "una", "reserva"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'hotel'",
            {},
            "hotel",
        ),
        (
            "fill_blank",
            "Quiero una ___. (room)",
            {
                "options": [
                    "habitación",
                    "casa",
                    "calle",
                    "mesa",
                ]
            },
            "habitación",
        ),
    ],

    # -----------------------------------------------------
    # REAL WORLD
    # -----------------------------------------------------

    "Shopping": [
        (
            "multiple_choice",
            "Which means 'how much'?",
            {
                "options": [
                    "cuánto",
                    "dónde",
                    "quién",
                    "cuándo",
                ]
            },
            "cuánto",
        ),
        (
            "translate",
            "Translate: 'How much does it cost?'",
            {
                "word_bank": [
                    "¿Cuánto",
                    "cuesta?",
                    "¿Dónde",
                    "está?",
                    "esto",
                ]
            },
            ["¿Cuánto", "cuesta?"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'money'",
            {},
            "dinero",
        ),
        (
            "fill_blank",
            "Quiero ___ camisa. (this)",
            {
                "options": [
                    "esta",
                    "este",
                    "esto",
                    "estas",
                ]
            },
            "esta",
        ),
    ],

    "Work": [
        (
            "multiple_choice",
            "Which means 'office'?",
            {
                "options": [
                    "oficina",
                    "escuela",
                    "casa",
                    "tienda",
                ]
            },
            "oficina",
        ),
        (
            "translate",
            "Translate: 'I work here'",
            {
                "word_bank": [
                    "Yo",
                    "trabajo",
                    "aquí",
                    "allí",
                    "vivo",
                ]
            },
            ["Yo", "trabajo", "aquí"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'meeting'",
            {},
            "reunión",
        ),
        (
            "fill_blank",
            "Tengo una ___ hoy. (meeting)",
            {
                "options": [
                    "reunión",
                    "casa",
                    "comida",
                    "calle",
                ]
            },
            "reunión",
        ),
    ],

    "Social Life": [
        (
            "multiple_choice",
            "Which means 'let's go'?",
            {
                "options": [
                    "vamos",
                    "ven",
                    "hola",
                    "gracias",
                ]
            },
            "vamos",
        ),
        (
            "translate",
            "Translate: 'See you later'",
            {
                "word_bank": [
                    "Hasta",
                    "luego",
                    "mañana",
                    "gracias",
                    "adiós",
                ]
            },
            ["Hasta", "luego"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'party'",
            {},
            "fiesta",
        ),
        (
            "fill_blank",
            "Vamos a la ___. (party)",
            {
                "options": [
                    "fiesta",
                    "casa",
                    "escuela",
                    "oficina",
                ]
            },
            "fiesta",
        ),
    ],

    # -----------------------------------------------------
    # CONVERSATION
    # -----------------------------------------------------

    "Past Tense": [
        (
            "multiple_choice",
            "Which means 'I went'?",
            {
                "options": [
                    "fui",
                    "voy",
                    "iré",
                    "vas",
                ]
            },
            "fui",
        ),
        (
            "translate",
            "Translate: 'I ate yesterday'",
            {
                "word_bank": [
                    "Comí",
                    "ayer",
                    "hoy",
                    "como",
                    "pan",
                ]
            },
            ["Comí", "ayer"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'I saw'",
            {},
            "vi",
        ),
        (
            "fill_blank",
            "Ayer ___ al parque. (I went)",
            {
                "options": [
                    "fui",
                    "voy",
                    "iré",
                    "vas",
                ]
            },
            "fui",
        ),
    ],

    "Future": [
        (
            "multiple_choice",
            "Which means 'I will go'?",
            {
                "options": [
                    "iré",
                    "fui",
                    "voy",
                    "iba",
                ]
            },
            "iré",
        ),
        (
            "translate",
            "Translate: 'I will eat tomorrow'",
            {
                "word_bank": [
                    "Comeré",
                    "mañana",
                    "ayer",
                    "como",
                    "hoy",
                ]
            },
            ["Comeré", "mañana"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'I will study'",
            {},
            "estudiaré",
        ),
        (
            "fill_blank",
            "Mañana ___ español. (I will study)",
            {
                "options": [
                    "estudiaré",
                    "estudio",
                    "estudié",
                    "estudias",
                ]
            },
            "estudiaré",
        ),
    ],

    "Conversation": [
        (
            "multiple_choice",
            "How do you say 'Nice to meet you'?",
            {
                "options": [
                    "Mucho gusto",
                    "Buenos días",
                    "Hasta luego",
                    "Por favor",
                ]
            },
            "Mucho gusto",
        ),
        (
            "translate",
            "Translate: 'Where are you from?'",
            {
                "word_bank": [
                    "¿De",
                    "dónde",
                    "eres?",
                    "¿Qué",
                    "haces?",
                ]
            },
            ["¿De", "dónde", "eres?"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'I am from India'",
            {},
            "soy de India",
        ),
        (
            "fill_blank",
            "Mucho ___ . (pleasure)",
            {
                "options": [
                    "gusto",
                    "gracias",
                    "hola",
                    "favor",
                ]
            },
            "gusto",
        ),
    ],

    "Review": [
        (
            "multiple_choice",
            "Which means 'thank you'?",
            {
                "options": [
                    "gracias",
                    "hola",
                    "adiós",
                    "perdón",
                ]
            },
            "gracias",
        ),
        (
            "translate",
            "Translate: 'I speak Spanish'",
            {
                "word_bank": [
                    "Yo",
                    "hablo",
                    "español",
                    "inglés",
                    "vivo",
                ]
            },
            ["Yo", "hablo", "español"],
        ),
        (
            "type_answer",
            "Type in Spanish: 'please'",
            {},
            "por favor",
        ),
        (
            "fill_blank",
            "Yo ___ español. (speak)",
            {
                "options": [
                    "hablo",
                    "hablas",
                    "habla",
                    "hablan",
                ]
            },
            "hablo",
        ),
    ],
}


# =========================================================
# EXERCISE BUILDER
# =========================================================

def build_exercises(skill_title: str, lesson_idx: int):
    items = EXERCISE_BANK.get(
        skill_title,
        EXERCISE_BANK["Basics 1"],
    )

    # Rotate exercises between lessons.
    rotation = lesson_idx % len(items)

    rotated = (
        items[rotation:]
        + items[:rotation]
    )

    return rotated


# =========================================================
# COURSE STRUCTURE
# =========================================================

UNITS = [

    (
        "Unit 1: Greetings & Basics",
        "Learn greetings, introductions, and essential Spanish.",
        "#58CC02",
        [
            ("Basics 1", "🔤", 3),
            ("Basics 2", "👋", 3),
            ("Greetings", "💬", 3),
            ("Introductions", "🙋", 3),
        ],
    ),

    (
        "Unit 2: People",
        "Talk about people, friends, family, and descriptions.",
        "#1CB0F6",
        [
            ("Family", "👪", 3),
            ("People", "🧑", 3),
            ("Descriptions", "✨", 3),
        ],
    ),

    (
        "Unit 3: Food & Drinks",
        "Learn useful vocabulary for eating and ordering food.",
        "#FF9600",
        [
            ("Food", "🍎", 3),
            ("Drinks", "☕", 3),
            ("Restaurant", "🍽️", 3),
        ],
    ),

    (
        "Unit 4: Everyday Life",
        "Describe your home, routine, and everyday activities.",
        "#CE82FF",
        [
            ("Home", "🏠", 3),
            ("Daily Routine", "🌅", 3),
            ("Time & Dates", "📅", 3),
        ],
    ),

    (
        "Unit 5: Verbs & Questions",
        "Build sentences with common verbs and questions.",
        "#FF4B4B",
        [
            ("Verbs: Present", "🏃", 3),
            ("Common Verbs", "⚡", 3),
            ("Questions", "❓", 3),
        ],
    ),

    (
        "Unit 6: Travel",
        "Handle common situations while traveling.",
        "#00AFAF",
        [
            ("Directions", "🧭", 3),
            ("Transport", "🚆", 3),
            ("Hotel", "🏨", 3),
        ],
    ),

    (
        "Unit 7: Real World",
        "Use Spanish for shopping, work, and social situations.",
        "#A560E8",
        [
            ("Shopping", "🛍️", 3),
            ("Work", "💼", 3),
            ("Social Life", "🎉", 3),
        ],
    ),

    (
        "Unit 8: Conversation",
        "Put everything together in realistic conversations.",
        "#2B70C9",
        [
            ("Past Tense", "⏪", 3),
            ("Future", "🔮", 3),
            ("Conversation", "🗣️", 3),
            ("Review", "🏆", 3),
        ],
    ),
]


# =========================================================
# SEED
# =========================================================

def seed():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # IMPORTANT:
        # This expanded seed is intended for a fresh database.
        if db.query(models.Course).first():
            print(
                "DB already contains data."
                " Delete/backup duolingo.db before reseeding."
            )
            return

        # -------------------------------------------------
        # COURSE
        # -------------------------------------------------

        course = models.Course(
            name="Spanish",
            language_code="es",
            from_language="en",
            flag_emoji="🇪🇸",
        )

        db.add(course)
        db.flush()

        all_skills = []

        # -------------------------------------------------
        # UNITS / SKILLS / LESSONS
        # -------------------------------------------------

        for unit_index, (
            unit_title,
            description,
            color,
            skills_data,
        ) in enumerate(UNITS):

            unit = models.Unit(
                course_id=course.id,
                order_index=unit_index,
                title=unit_title,
                description=description,
                color_hex=color,
            )

            db.add(unit)
            db.flush()

            for skill_index, (
                skill_title,
                icon,
                lesson_count,
            ) in enumerate(skills_data):

                skill = models.Skill(
                    unit_id=unit.id,
                    order_index=skill_index,
                    title=skill_title,
                    icon=icon,
                    max_crowns=lesson_count,
                )

                db.add(skill)
                db.flush()

                all_skills.append(skill)

                for lesson_index in range(lesson_count):

                    lesson = models.Lesson(
                        skill_id=skill.id,
                        order_index=lesson_index,
                        xp_reward=10,
                    )

                    db.add(lesson)
                    db.flush()

                    exercises = build_exercises(
                        skill_title,
                        lesson_index,
                    )

                    for exercise_index, (
                        exercise_type,
                        prompt,
                        data,
                        answer,
                    ) in enumerate(exercises):

                        db.add(
                            models.Exercise(
                                lesson_id=lesson.id,
                                order_index=exercise_index,
                                type=exercise_type,
                                prompt=prompt,
                                data_json=j(data),
                                correct_answer_json=j(answer),
                            )
                        )

        # -------------------------------------------------
        # ACHIEVEMENTS
        # -------------------------------------------------

        achievements = [
            (
                "first_lesson",
                "First Steps",
                "Complete your first lesson",
                "🥉",
            ),
            (
                "streak_3",
                "On a Roll",
                "Reach a 3 day streak",
                "🔥",
            ),
            (
                "streak_7",
                "Week Warrior",
                "Reach a 7 day streak",
                "🔥",
            ),
            (
                "xp_100",
                "Century Club",
                "Earn 100 total XP",
                "💯",
            ),
            (
                "skill_master",
                "Skill Master",
                "Complete a full skill",
                "👑",
            ),
            (
                "perfectionist",
                "Perfectionist",
                "Finish a lesson with zero mistakes",
                "🌟",
            ),
        ]

        for code, title, description, icon in achievements:
            db.add(
                models.Achievement(
                    code=code,
                    title=title,
                    description=description,
                    icon=icon,
                )
            )

        # -------------------------------------------------
        # DEFAULT USER
        # -------------------------------------------------

        me = models.User(
            username="you",
            display_name="You",
            avatar_color="#58CC02",
            xp_total=30,
            xp_today=0,
            daily_goal_xp=20,
            streak_count=2,
            longest_streak=2,
            last_activity_date=date.today() - timedelta(days=1),
            hearts=5,
            max_hearts=5,
            gems=500,
        )

        db.add(me)
        db.flush()

        # First skill unlocked.
        db.add(
            models.UserSkillProgress(
                user_id=me.id,
                skill_id=all_skills[0].id,
                is_unlocked=True,
                crowns=1,
                is_completed=False,
            )
        )

        # Second skill also available.
        db.add(
            models.UserSkillProgress(
                user_id=me.id,
                skill_id=all_skills[1].id,
                is_unlocked=True,
                crowns=0,
                is_completed=False,
            )
        )

        # -------------------------------------------------
        # LEADERBOARD
        # -------------------------------------------------

        leaderboard_seed = [
            ("maria_l", "Maria", "#FF4B4B", 420),
            ("kenji_t", "Kenji", "#1CB0F6", 310),
            ("amara_o", "Amara", "#CE82FF", 275),
            ("liam_k", "Liam", "#FF9600", 150),
            ("sofia_r", "Sofia", "#2B70C9", 95),
        ]

        for username, display_name, color, xp in leaderboard_seed:

            db.add(
                models.User(
                    username=username,
                    display_name=display_name,
                    avatar_color=color,
                    xp_total=xp,
                    xp_today=0,
                    daily_goal_xp=20,
                    streak_count=1,
                    longest_streak=1,
                    last_activity_date=date.today(),
                    hearts=5,
                    max_hearts=5,
                    gems=200,
                )
            )

        db.commit()

        print("======================================")
        print("Spanish course seeded successfully!")
        print("======================================")
        print("Units: 8")
        print("Skills: 27")
        print("Lessons: 81")
        print("Exercises: 324")
        print("======================================")

    finally:
        db.close()


if __name__ == "__main__":
    seed()