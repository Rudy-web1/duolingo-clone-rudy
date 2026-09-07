"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Target, Zap, ArrowRight } from "lucide-react";
import type { LessonCompleteResponse } from "@/lib/types";

export default function LessonCompleteModal({
  result,
  accuracy,
}: {
  result: LessonCompleteResponse;
  accuracy: number;
}) {
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [xpValue, setXpValue] = useState(0);

  useEffect(() => {
    setShow(true);

    let current = 0;
    const target = result.xp_earned;
    const step = Math.max(1, Math.ceil(target / 12));

    const counter = setInterval(() => {
      current += step;

      if (current >= target) {
        current = target;
        clearInterval(counter);
      }

      setXpValue(current);
    }, 55);

    return () => clearInterval(counter);
  }, [result.xp_earned]);

  const accuracyPercent = Math.round(accuracy * 100);

  return (
    <div className={`complete-overlay ${show ? "complete-show" : ""}`}>
      <div className="complete-glow complete-glow-one" />
      <div className="complete-glow complete-glow-two" />

      <div className="complete-modal">
        <div className="complete-confetti" aria-hidden="true">
          <span>✦</span>
          <span>•</span>
          <span>✦</span>
          <span>•</span>
          <span>✦</span>
          <span>•</span>
        </div>

        <div className="complete-trophy">
          <div className="trophy-ring">
            {result.is_skill_completed ? "🏆" : "🎉"}
          </div>
        </div>

        <div className="complete-eyebrow">
          {result.is_skill_completed ? "SKILL FINISHED" : "LESSON FINISHED"}
        </div>

        <h1>
          {result.is_skill_completed
            ? "Skill complete!"
            : "Lesson complete!"}
        </h1>

        <p className="complete-subtitle">
          Nice work! You&apos;re one step closer to fluency.
        </p>

        {result.leveled_up_achievement && (
          <div className="complete-achievement">
            🏅 New achievement: {result.leveled_up_achievement}
          </div>
        )}

        <div className="complete-stats">
          <div className="complete-stat xp-stat">
            <div className="complete-stat-icon">
              <Zap size={24} fill="currentColor" />
            </div>

            <div className="complete-stat-value">
              +{xpValue}
            </div>

            <div className="complete-stat-label">
              XP EARNED
            </div>
          </div>

          <div className="complete-stat accuracy-stat">
            <div className="complete-stat-icon">
              <Target size={24} />
            </div>

            <div className="complete-stat-value">
              {accuracyPercent}%
            </div>

            <div className="complete-stat-label">
              ACCURACY
            </div>
          </div>

          <div className="complete-stat streak-stat">
            <div className="complete-stat-icon">
              <Flame size={25} fill="currentColor" />
            </div>

            <div className="complete-stat-value">
              {result.streak_count}
            </div>

            <div className="complete-stat-label">
              DAY STREAK
            </div>
          </div>
        </div>

        <div className="complete-message">
          <span>🔥</span>
          <strong>Keep your streak alive!</strong>
        </div>

        <button
          className="complete-continue"
          onClick={() => router.push("/")}
        >
          <span>CONTINUE</span>
          <ArrowRight size={21} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}