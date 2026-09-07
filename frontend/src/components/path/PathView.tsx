"use client";

import { useEffect, useState } from "react";
import type { CourseOut, SkillOut } from "@/lib/types";
import SkillNode from "./SkillNode";

const ZIGZAG = [-70, 0, 70, 35, -35, -70, 0, 70];

type UserStats = {
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
};

export default function PathView({ course }: { course: CourseOut }) {
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    streak: 0,
    hearts: 0,
    gems: 0,
  });

  /* ---------------------------------------------
     Load real user stats from backend
     --------------------------------------------- */

  useEffect(() => {
    fetch("http://localhost:8000/api/users/1")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load user stats");
        }

        return res.json();
      })
      .then((data) => {
        setStats({
          xp: data.xp_total ?? 0,
          streak: data.streak_count ?? 0,
          hearts: data.hearts ?? 0,
          gems: data.gems ?? 0,
        });
      })
      .catch(() => {
        // Keep the page usable if stats fail to load.
      });
  }, []);

  /* ---------------------------------------------
     Flatten skills
     --------------------------------------------- */

  const flatSkills: SkillOut[] = course.units.flatMap(
    (unit) => unit.skills
  );

  /* ---------------------------------------------
     Find current skill
     --------------------------------------------- */

  const currentSkill = flatSkills.find(
    (skill) => skill.is_unlocked && !skill.is_completed
  );

  /* ---------------------------------------------
     Overall course progress
     --------------------------------------------- */

  const totalSkills = flatSkills.length;

  const completedSkills = flatSkills.filter(
    (skill) => skill.is_completed
  ).length;

  const overallProgress =
    totalSkills > 0
      ? Math.round((completedSkills / totalSkills) * 100)
      : 0;

  return (
    <main className="path-page">
      <div className="path-container">

        {/* =================================================
            TOP STATS
            ================================================= */}

        <div className="path-stats-bar">

          <div className="path-stat">
            <span className="path-stat-icon">🔥</span>
            <span>{stats.streak}</span>
          </div>

          <div className="path-stat">
            <span className="path-stat-icon">⚡</span>
            <span>{stats.xp}</span>
          </div>

          <div className="path-stat">
            <span className="path-stat-icon">💎</span>
            <span>{stats.gems}</span>
          </div>

          <div className="path-stat">
            <span className="path-stat-icon">❤️</span>
            <span>{stats.hearts}</span>
          </div>

        </div>

        {/* =================================================
            COURSE HEADER
            ================================================= */}

        <div className="course-heading">

          <div className="course-heading-left">

            <div className="course-eyebrow">
              {course.flag_emoji} SPANISH
            </div>

            <h1 className="course-title">
              Spanish
            </h1>

            <p className="course-subtitle">
              Learn Spanish step by step
            </p>

          </div>

          <button className="language-selector">

            <span className="language-flag">
              {course.flag_emoji}
            </span>

            <span>
              Spanish
            </span>

            <span className="language-chevron">
              ⌄
            </span>

          </button>

        </div>

        {/* =================================================
            OVERALL PROGRESS
            ================================================= */}

        <div className="course-progress-card">

          <div className="course-progress-info">

            <div>

              <strong>
                Your progress
              </strong>

              <span>
                {completedSkills} of {totalSkills} skills completed
              </span>

            </div>

            <strong className="course-progress-percent">
              {overallProgress}%
            </strong>

          </div>

          <div className="course-progress-track">

            <div
              className="course-progress-fill"
              style={{
                width: `${overallProgress}%`,
              }}
            />

          </div>

        </div>

        {/* =================================================
            UNITS
            ================================================= */}

        {course.units.map((unit, unitIndex) => {

          const completed =
            getCompletedSkills(unit.skills);

          const progress =
            getUnitProgress(unit.skills);

          const isCurrentUnit =
            unit.skills.some(
              (skill) =>
                skill.id === currentSkill?.id
            );

          return (
            <section
              key={unit.id}
              className={`unit-section ${
                isCurrentUnit
                  ? "unit-section-current"
                  : ""
              }`}
            >

              {/* -----------------------------------------
                  Unit banner
                  ----------------------------------------- */}

              <div
                className="unit-card"
                style={{
                  backgroundColor:
                    unit.color_hex,
                }}
              >

                <div className="unit-card-content">

                  <div className="unit-number">
                    SECTION {unitIndex + 1} · UNIT{" "}
                    {unitIndex + 1}
                  </div>

                  <h2>
                    {getUnitName(unit.title)}
                  </h2>

                  <p>
                    {unit.description}
                  </p>

                  <div className="unit-progress-row">

                    <div className="unit-progress-track">

                      <div
                        className="unit-progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      />

                    </div>

                    <span>
                      {completed}/{unit.skills.length}
                    </span>

                  </div>

                </div>

                <div className="unit-decoration">
                  {getUnitEmoji(unitIndex)}
                </div>

              </div>

              {/* -----------------------------------------
                  Learning path
                  ----------------------------------------- */}

              <div className="path-track">

                <div className="path-line" />

                {unit.skills.map(
                  (skill, index) => {

                    const offset =
                      ZIGZAG[
                        index % ZIGZAG.length
                      ];

                    return (
                      <SkillNode
                        key={skill.id}
                        skill={skill}
                        color={unit.color_hex}
                        offsetPx={offset}
                        isCurrent={
                          currentSkill?.id ===
                          skill.id
                        }
                      />
                    );
                  }
                )}

              </div>

            </section>
          );
        })}

        {/* =================================================
            COURSE END
            ================================================= */}

        <div className="path-end">

          <div className="path-end-icon">
            🏆
          </div>

          <h3>
            Keep going!
          </h3>

          <p>
            Complete more skills to unlock
            the next part of your Spanish journey.
          </p>

          <div className="path-end-progress">
            {completedSkills} / {totalSkills} skills
          </div>

        </div>

      </div>
    </main>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function getUnitName(title: string) {
  if (title.includes(":")) {
    return title
      .split(":")
      .slice(1)
      .join(":")
      .trim();
  }

  return title;
}

function getCompletedSkills(
  skills: SkillOut[]
) {
  return skills.filter(
    (skill) => skill.is_completed
  ).length;
}

function getUnitProgress(
  skills: SkillOut[]
) {
  if (!skills.length) {
    return 0;
  }

  const completed =
    skills.filter(
      (skill) => skill.is_completed
    ).length;

  return Math.round(
    (completed / skills.length) * 100
  );
}

function getUnitEmoji(index: number) {
  const emojis = [
    "👋",
    "🍎",
    "💬",
    "✈️",
    "🛍️",
    "🗣️",
    "🏙️",
    "💭",
  ];

  return emojis[index] || "📚";
}