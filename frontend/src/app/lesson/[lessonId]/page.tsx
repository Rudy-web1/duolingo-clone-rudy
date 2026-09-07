"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sparkles } from "lucide-react";

import LessonHeader from "@/components/lesson/LessonHeader";
import ExerciseRenderer from "@/components/lesson/ExerciseRenderer";
import FeedbackBar from "@/components/lesson/FeedbackBar";
import OutOfHeartsModal from "@/components/modals/OutOfHeartsModal";
import LessonCompleteModal from "@/components/modals/LessonCompleteModal";

import { api } from "@/lib/api";

import type {
  LessonDetail,
  AnswerResult,
  LessonCompleteResponse,
} from "@/lib/types";

function formatCorrectAnswer(value: any): string | undefined {
  if (value == null) return undefined;

  if (Array.isArray(value)) {
    return value.join(" ");
  }

  if (typeof value === "object") {
    return undefined;
  }

  return String(value);
}

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = Number(params.lessonId);

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [hearts, setHearts] = useState(5);

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<any>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);

  const [mistakes, setMistakes] = useState(0);
  const [heartsLost, setHeartsLost] = useState(0);

  const [outOfHearts, setOutOfHearts] = useState(false);
  const [complete, setComplete] =
    useState<LessonCompleteResponse | null>(null);

  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    Promise.all([
      api.getLesson(lessonId),
      api.getUser(),
    ])
      .then(([lessonData, user]) => {
        setLesson(lessonData);
        setHearts(user.hearts);
      })
      .catch((e) => {
        setError(String(e?.message || e));
      });
  }, [lessonId]);

  if (error) {
    return (
      <main className="lesson-error">
        <div>
          <div className="text-6xl mb-5">😵</div>

          <h1>Something went wrong</h1>

          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!lesson) {
    return (
      <main className="lesson-loading">
        <div className="lesson-loading-logo">
          duolingo
        </div>

        <div className="lesson-spinner" />

        <p>Preparing your lesson...</p>
      </main>
    );
  }

  if (!lesson.exercises.length) {
    return (
      <main className="lesson-error">
        <div>
          <h1>No exercises found</h1>
          <p>This lesson doesn't contain any exercises yet.</p>
        </div>
      </main>
    );
  }

  const exercise = lesson.exercises[index];

  // Current question counts toward progress.
  const progress =
    (index + 1) / lesson.exercises.length;

  const handleCheck = async () => {
    if (answer == null || checking || result) return;

    setChecking(true);

    try {
      const res = await api.checkAnswer(
        exercise.id,
        answer
      );

      setResult(res);
      setHearts(res.hearts_remaining);

      if (!res.correct) {
        setMistakes((m) => m + 1);
        setHeartsLost((h) => h + 1);
      }
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setChecking(false);
    }
  };

  const handleContinue = async () => {
    const heartsNow =
      result && !result.correct
        ? result.hearts_remaining
        : hearts;

    if (
      result &&
      !result.correct &&
      heartsNow <= 0
    ) {
      setOutOfHearts(true);
      return;
    }

    if (
      index + 1 <
      lesson.exercises.length
    ) {
      setIndex((i) => i + 1);
      setAnswer(null);
      setResult(null);
      return;
    }

    try {
      const res =
        await api.completeLesson(
          lessonId,
          mistakes,
          heartsLost
        );

      setComplete(res);
    } catch (e: any) {
      setError(String(e?.message || e));
    }
  };

  const handleRefill = async () => {
    try {
      const res = await api.refillHearts();

      setHearts(res.hearts);
      setOutOfHearts(false);
    } catch (e: any) {
      setError(String(e?.message || e));
    }
  };

  const accuracy =
    lesson.exercises.length > 0
      ? Math.max(
          0,
          (lesson.exercises.length - mistakes) /
            lesson.exercises.length
        )
      : 1;

  return (
    <main className="lesson-page">

      {/* HEADER */}
      <LessonHeader
        progress={progress}
        hearts={hearts}
        current={index + 1}
        total={lesson.exercises.length}
      />

      {/* MAIN LESSON AREA */}
      <section className="lesson-content">

        <div className="lesson-skill-label">
          <span>
            {lesson.skill_title}
          </span>

          <Sparkles size={17} />
        </div>

        <div className="lesson-question-area">
          <ExerciseRenderer
            exercise={exercise}
            onAnswerChange={setAnswer}
            locked={!!result}
            result={result}
          />
        </div>

      </section>

      {/* CHECK BAR */}
      {!result && (
        <div className="lesson-check-bar">
          <div className="lesson-check-inner">

            <div className="lesson-check-hint">
              {answer == null
                ? "Choose an answer to continue"
                : "Ready to check your answer"}
            </div>

            <button
              onClick={handleCheck}
              disabled={
                answer == null ||
                checking
              }
              className={`lesson-check-button ${
                answer == null || checking
                  ? "disabled"
                  : ""
              }`}
            >
              {checking
                ? "Checking..."
                : "Check"}
            </button>

          </div>
        </div>
      )}

      {/* FEEDBACK */}
      {result && (
        <FeedbackBar
          correct={result.correct}
          correctAnswerText={formatCorrectAnswer(
            result.correct_answer
          )}
          onContinue={handleContinue}
        />
      )}

      {/* OUT OF HEARTS */}
      {outOfHearts && (
        <OutOfHeartsModal
          onRefill={handleRefill}
        />
      )}

      {/* COMPLETE */}
      {complete && (
        <LessonCompleteModal
          result={complete}
          accuracy={accuracy}
        />
      )}

    </main>
  );
}