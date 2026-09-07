"use client";

import { useRouter } from "next/navigation";
import { X, Heart } from "lucide-react";

export default function LessonHeader({
  progress,
  hearts,
  current,
  total,
}: {
  progress: number;
  hearts: number;
  current: number;
  total: number;
}) {
  const router = useRouter();

  return (
    <header className="lesson-header">
      <button
        onClick={() => router.push("/")}
        aria-label="Exit lesson"
        className="lesson-exit"
      >
        <X size={28} strokeWidth={3} />
      </button>

      <div className="lesson-progress-wrap">
        <div className="lesson-progress-track">
          <div
            className="lesson-progress-fill"
            style={{
              width: `${Math.min(100, Math.max(0, progress * 100))}%`,
            }}
          />
        </div>

        <span className="lesson-counter">
          {current} / {total}
        </span>
      </div>

      <div className="lesson-hearts">
        <Heart
          size={25}
          fill="currentColor"
          strokeWidth={2.5}
        />
        <span>{hearts}</span>
      </div>
    </header>
  );
}