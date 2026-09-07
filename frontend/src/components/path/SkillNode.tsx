"use client";

import { BookOpen, Check, Lock, Play, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SkillOut } from "@/lib/types";

export default function SkillNode({
  skill,
  color,
  offsetPx,
  isCurrent,
}: {
  skill: SkillOut;
  color: string;
  offsetPx: number;
  isCurrent: boolean;
}) {
  const router = useRouter();

  const locked = !skill.is_unlocked;
  const completed = skill.is_completed;

  /*
   * Lessons use zero-based order_index:
   *
   * crown 0 → lesson 0
   * crown 1 → lesson 1
   * crown 2 → lesson 2
   *
   * Keep this progression logic unchanged.
   */
  const nextLesson =
    skill.lessons.find(
      (lesson) => lesson.order_index === skill.crowns
    ) || skill.lessons[0];

  function handleClick() {
    if (locked || !nextLesson) return;

    router.push(
      `/lesson/${nextLesson.id}?skill=${skill.id}`
    );
  }

  function handleLearnClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    /*
     * Prevent the Learn button from triggering the main
     * skill-node button behavior.
     */
    event.stopPropagation();

    router.push(`/guidebook/${skill.id}`);
  }

  const progressPercent =
    skill.max_crowns > 0
      ? Math.round(
          (skill.crowns / skill.max_crowns) * 100
        )
      : 0;

  return (
    <div
      className={`path-node-wrapper ${
        isCurrent ? "path-node-current" : ""
      }`}
      style={{
        transform: `translateX(${offsetPx}px)`,
      }}
    >
      {isCurrent && !locked && (
        <div className="current-pill">
          <Play size={13} fill="currentColor" />
          {skill.crowns === 0
            ? "START"
            : "CONTINUE"}
        </div>
      )}

      {/* Main skill button */}
      <button
        onClick={handleClick}
        disabled={locked}
        aria-label={
          locked
            ? `${skill.title} locked`
            : `${skill.title}, ${skill.crowns} of ${skill.max_crowns} levels`
        }
        className={[
          "skill-node-button",
          locked ? "locked" : "",
          completed ? "completed" : "",
          isCurrent ? "current" : "",
        ].join(" ")}
        style={
          locked
            ? undefined
            : { backgroundColor: color }
        }
      >
        {locked ? (
          <Lock
            size={27}
            strokeWidth={3}
          />
        ) : completed ? (
          <Check
            size={39}
            strokeWidth={4}
          />
        ) : (
          <span className="skill-node-icon">
            {skill.icon}
          </span>
        )}
      </button>

      <div
        className={`skill-label ${
          locked
            ? "skill-label-locked"
            : ""
        }`}
      >
        {skill.title}
      </div>

      {/* =====================================================
          GUIDEBOOK BUTTON
          Available for every skill, including locked skills.
          This does NOT unlock the lesson.
          ===================================================== */}
      <button
        type="button"
        onClick={handleLearnClick}
        className="skill-learn-button"
        aria-label={`Learn ${skill.title}`}
      >
        <BookOpen
          size={14}
          strokeWidth={3}
        />

        <span>LEARN</span>
      </button>

      {!locked &&
        skill.max_crowns > 0 && (
          <div className="skill-progress-area">
            <div className="skill-crowns">
              {Array.from({
                length: skill.max_crowns,
              }).map((_, index) => (
                <span
                  key={index}
                  className={
                    index < skill.crowns
                      ? "crown-earned"
                      : "crown-empty"
                  }
                >
                  ★
                </span>
              ))}
            </div>

            <div className="skill-progress-text">
              {completed
                ? "MASTERED"
                : `LEVEL ${Math.min(
                    skill.crowns + 1,
                    skill.max_crowns
                  )} OF ${
                    skill.max_crowns
                  }`}
            </div>

            {!completed && (
              <div className="skill-mini-progress">
                <div
                  className="skill-mini-progress-fill"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            )}

            {completed && (
              <div className="skill-complete-label">
                ✓ COMPLETE
              </div>
            )}
          </div>
        )}

      {completed && (
        <div className="skill-review-hint">
          <RotateCcw size={12} />
          Review
        </div>
      )}
    </div>
  );
}