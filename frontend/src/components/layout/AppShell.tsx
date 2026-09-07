"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Trophy,
  Target,
  ShoppingBag,
  UserRound,
  MoreHorizontal,
} from "lucide-react";

import { api } from "@/lib/api";
import type { UserOut } from "@/lib/types";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({
  children,
}: AppShellProps) {
  const pathname = usePathname();

  const [rightSidebarOpen, setRightSidebarOpen] =
    useState(true);

  const [user, setUser] =
    useState<UserOut | null>(null);

  useEffect(() => {
    api
      .getUser()
      .then(setUser)
      .catch(() => {});
  }, []);

  const streak = user?.streak_count ?? 3;
  const xp = user?.xp_total ?? 95;
  const gems = user?.gems ?? 500;
  const hearts = user?.hearts ?? 5;

  const dailyGoal = user?.daily_goal_xp ?? 20;
  const xpToday = user?.xp_today ?? 0;

  const dailyProgress = Math.min(
    100,
    (xpToday / Math.max(1, dailyGoal)) * 100
  );

  const isLearn =
    pathname === "/" ||
    pathname.startsWith("/lesson");

  const isLeaderboard =
    pathname.startsWith("/leaderboard");

  const isProfile =
    pathname.startsWith("/profile");

  return (
    <div
      className={`duo-app ${
        rightSidebarOpen
          ? "right-open"
          : "right-collapsed"
      }`}
    >
      {/* =====================================================
          LEFT SIDEBAR
          ===================================================== */}

      <aside className="duo-sidebar">

        {/* LOGO */}

        <Link
          href="/"
          className="duo-brand"
        >
          <span className="duo-brand-word">
            duolingo
          </span>
        </Link>


        {/* NAVIGATION */}

        <nav className="duo-nav">

          <Link
            href="/"
            className={`duo-nav-item ${
              isLearn ? "active" : ""
            }`}
          >
            <span className="duo-nav-icon">
              <BookOpen
                size={28}
                strokeWidth={2.8}
              />
            </span>

            <span>Learn</span>
          </Link>


          <Link
            href="/leaderboard"
            className={`duo-nav-item ${
              isLeaderboard ? "active" : ""
            }`}
          >
            <span className="duo-nav-icon">
              <Trophy
                size={28}
                strokeWidth={2.8}
              />
            </span>

            <span>Leaderboards</span>
          </Link>


          <button
            type="button"
            className="duo-nav-item"
            onClick={() =>
              alert("Quests coming soon!")
            }
          >
            <span className="duo-nav-icon">
              <Target
                size={28}
                strokeWidth={2.8}
              />
            </span>

            <span>Quests</span>
          </button>


          <button
            type="button"
            className="duo-nav-item"
            onClick={() =>
              alert("Shop coming soon!")
            }
          >
            <span className="duo-nav-icon">
              <ShoppingBag
                size={28}
                strokeWidth={2.8}
              />
            </span>

            <span>Shop</span>
          </button>


          <Link
            href="/profile"
            className={`duo-nav-item ${
              isProfile ? "active" : ""
            }`}
          >
            <span className="duo-nav-icon">
              <UserRound
                size={28}
                strokeWidth={2.8}
              />
            </span>

            <span>Profile</span>
          </Link>


          <button
            type="button"
            className="duo-nav-item"
            onClick={() =>
              alert("More settings coming soon!")
            }
          >
            <span className="duo-nav-icon">
              <MoreHorizontal
                size={28}
                strokeWidth={2.8}
              />
            </span>

            <span>More</span>
          </button>

        </nav>


        {/* ===================================================
            DAILY GOAL
            =================================================== */}

        <div className="duo-daily-card">

          <div className="duo-daily-header">
            <span>DAILY GOAL</span>
            <span>🎯</span>
          </div>

          <div className="duo-daily-value">
            {xpToday} / {dailyGoal} XP
          </div>

          <div className="duo-daily-track">
            <div
              className="duo-daily-fill"
              style={{
                width: `${dailyProgress}%`,
              }}
            />
          </div>

          <div className="duo-daily-footer">
            {xpToday >= dailyGoal
              ? "Daily goal complete! 🎉"
              : "Keep your streak alive!"}
          </div>

        </div>

      </aside>


      {/* =====================================================
          CENTER CONTENT
          ===================================================== */}

      <main className="duo-main">
        <div className="duo-main-inner">
          {children}
        </div>
      </main>


      {/* =====================================================
          RIGHT SIDEBAR
          ===================================================== */}

      <aside
        className={`duo-right ${
          rightSidebarOpen
            ? "is-open"
            : "is-collapsed"
        }`}
      >

        <button
          type="button"
          className="duo-sidebar-toggle"
          onClick={() =>
            setRightSidebarOpen(false)
          }
          aria-label="Collapse sidebar"
        >
          ›
        </button>


        {/* STATS */}

        <div className="duo-stats">

          <div className="duo-stat">
            <span className="duo-stat-icon">
              🔥
            </span>

            <span>{streak}</span>
          </div>

          <div className="duo-stat">
            <span className="duo-stat-icon">
              ⚡
            </span>

            <span>{xp}</span>
          </div>

          <div className="duo-stat">
            <span className="duo-stat-icon">
              💎
            </span>

            <span>{gems}</span>
          </div>

          <div className="duo-stat">
            <span className="duo-stat-icon">
              ❤️
            </span>

            <span>{hearts}</span>
          </div>

        </div>


        {/* DAILY GOAL */}

        <div className="duo-side-card">

          <div className="duo-side-card-title">
            DAILY GOAL
          </div>

          <div className="duo-side-card-value">
            {xpToday} / {dailyGoal} XP
          </div>

          <div className="duo-side-progress">
            <div
              className="duo-side-progress-fill"
              style={{
                width: `${dailyProgress}%`,
              }}
            />
          </div>

          <p className="duo-side-card-text">
            {xpToday >= dailyGoal
              ? "You've reached today's goal!"
              : "Complete a lesson to reach your daily goal."}
          </p>

        </div>


        {/* STREAK */}

        <div className="duo-side-card">

          <div className="duo-side-card-title">
            YOUR STREAK
          </div>

          <div className="duo-streak-display">
            🔥 <strong>{streak}</strong>
          </div>

          <p className="duo-side-card-text">
            Keep learning every day to protect
            your streak.
          </p>

        </div>


        {/* PROGRESS */}

        <div className="duo-side-card">

          <div className="duo-side-card-title">
            YOUR PROGRESS
          </div>

          <div className="duo-mini-stat">
            <span>Total XP</span>
            <strong>{xp}</strong>
          </div>

          <div className="duo-mini-stat">
            <span>Daily XP</span>
            <strong>{xpToday}</strong>
          </div>

          <div className="duo-mini-stat">
            <span>Hearts</span>
            <strong>
              ❤️ {hearts}/{user?.max_hearts ?? 5}
            </strong>
          </div>

        </div>

      </aside>


      {/* =====================================================
          EXPAND RIGHT SIDEBAR
          ===================================================== */}

      {!rightSidebarOpen && (
        <button
          type="button"
          className="duo-sidebar-expand"
          onClick={() =>
            setRightSidebarOpen(true)
          }
          aria-label="Expand sidebar"
        >
          ‹
        </button>
      )}

    </div>
  );
}