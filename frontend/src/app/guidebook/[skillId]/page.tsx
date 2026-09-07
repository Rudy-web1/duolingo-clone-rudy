"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Lightbulb,
  Volume2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import type { GuidebookResponse } from "@/lib/types";

export default function GuidebookPage() {
  const params = useParams();
  const router = useRouter();

  const skillId = Number(params.skillId);

  const [data, setData] =
    useState<GuidebookResponse | null>(null);

  const [currentCard, setCurrentCard] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!skillId || Number.isNaN(skillId)) {
      setError("Invalid skill.");
      return;
    }

    api
      .getGuidebook(skillId)
      .then(setData)
      .catch((e) => {
        setError(String(e?.message || e));
      });
  }, [skillId]);

  const cards = data?.cards || [];
  const card = cards[currentCard];

  const progress = useMemo(() => {
    if (!cards.length) return 100;

    return (
      ((currentCard + 1) / cards.length) *
      100
    );
  }, [currentCard, cards.length]);

  function speak(text: string) {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "es-ES";
    utterance.rate = 0.85;

    window.speechSynthesis.speak(utterance);
  }

  function nextCard() {
    if (!data) return;

    if (currentCard < cards.length - 1) {
      setCurrentCard((value) => value + 1);
      return;
    }

    startLesson();
  }

  function previousCard() {
    if (currentCard > 0) {
      setCurrentCard((value) => value - 1);
    }
  }

  function startLesson() {
    if (!data?.next_lesson_id) {
      return;
    }

    router.push(
      `/lesson/${data.next_lesson_id}?skill=${data.skill.id}`
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="guidebook-page">
          <div className="guidebook-error">
            <div className="guidebook-error-icon">
              😵
            </div>

            <h2>Couldn't load this lesson</h2>

            <p>{error}</p>

            <button
              onClick={() => router.push("/")}
              className="guidebook-primary-button"
            >
              Back to learning path
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell>
        <div className="guidebook-page">
          <div className="guidebook-loading">
            <div className="guidebook-spinner" />

            <p>Preparing your lesson...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!cards.length) {
    return (
      <AppShell>
        <div className="guidebook-page">
          <div className="guidebook-container">
            <button
              onClick={() => router.push("/")}
              className="guidebook-back-button"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <div className="guidebook-empty">
              <div className="guidebook-empty-icon">
                {data.skill.icon}
              </div>

              <h1>{data.skill.title}</h1>

              <p>
                {data.intro ||
                  "You're ready to practice this skill."}
              </p>

              <button
                onClick={startLesson}
                disabled={!data.next_lesson_id}
                className="guidebook-primary-button"
              >
                {data.progress.is_completed
                  ? "Review lesson"
                  : "Start practice"}
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const isLastCard =
    currentCard === cards.length - 1;

  return (
    <AppShell>
      <div className="guidebook-page">
        <div className="guidebook-container">
          {/* Header */}
          <div className="guidebook-top">
            <button
              onClick={() => router.push("/")}
              className="guidebook-back-button"
              aria-label="Back to learning path"
            >
              <ArrowLeft size={21} />
              <span>Back</span>
            </button>

            <div className="guidebook-title-area">
              <div className="guidebook-skill-icon">
                {data.skill.icon}
              </div>

              <div>
                <div className="guidebook-eyebrow">
                  LEARN
                </div>

                <h1>{data.skill.title}</h1>
              </div>
            </div>

            <div className="guidebook-card-count">
              {currentCard + 1} / {cards.length}
            </div>
          </div>

          {/* Skill progress */}
          <div className="guidebook-skill-progress">
            <span>
              LEVEL {Math.min(
                data.progress.crowns + 1,
                data.skill.max_crowns
              )}{" "}
              OF {data.skill.max_crowns}
            </span>

            <span>
              {data.progress.crowns} /{" "}
              {data.skill.max_crowns} crowns
            </span>
          </div>

          {/* Card progress */}
          <div className="guidebook-progress">
            <div
              className="guidebook-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Intro */}
          {currentCard === 0 && (
            <div className="guidebook-intro">
              <h2>{data.subtitle}</h2>

              <p>{data.intro}</p>
            </div>
          )}

          {/* Teaching card */}
          <div
            className="guidebook-card"
            key={currentCard}
          >
            <div className="guidebook-card-type">
              {card.type === "sentence"
                ? "USE IT"
                : "NEW WORD"}
            </div>

            <div className="guidebook-word-row">
              <div className="guidebook-spanish">
                {card.spanish}
              </div>

              <button
                onClick={() =>
                  speak(card.spanish)
                }
                className="guidebook-audio-button"
                aria-label={`Listen to ${card.spanish}`}
                title="Listen"
              >
                <Volume2 size={23} />
              </button>
            </div>

            <div className="guidebook-english">
              {card.english}
            </div>

            <div className="guidebook-divider" />

            <div className="guidebook-tip">
              <div className="guidebook-tip-icon">
                <Lightbulb size={20} />
              </div>

              <div>
                <div className="guidebook-tip-title">
                  TIP
                </div>

                <div className="guidebook-tip-text">
                  {card.tip}
                </div>
              </div>
            </div>
          </div>

          {/* Card dots */}
          <div className="guidebook-dots">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrentCard(index)
                }
                aria-label={`Go to card ${
                  index + 1
                }`}
                className={[
                  "guidebook-dot",
                  index === currentCard
                    ? "guidebook-dot-active"
                    : "",
                  index < currentCard
                    ? "guidebook-dot-done"
                    : "",
                ].join(" ")}
              >
                {index < currentCard ? (
                  <Check
                    size={11}
                    strokeWidth={4}
                  />
                ) : null}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="guidebook-actions">
            <button
              onClick={previousCard}
              disabled={currentCard === 0}
              className="guidebook-secondary-button"
            >
              Previous
            </button>

            <button
              onClick={nextCard}
              className="guidebook-primary-button guidebook-next-button"
            >
              {isLastCard
                ? data.progress.is_completed
                  ? "Review lesson"
                  : "Start lesson"
                : "Got it →"}
            </button>
          </div>

          {/* Footer */}
          <div className="guidebook-footer">
            {isLastCard ? (
              <>
                <span>🎯</span>
                Ready to put it into practice?
              </>
            ) : (
              <>
                <span>💡</span>
                Learn it here, then practice it in
                the lesson.
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}