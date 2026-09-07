"use client";

import Link from "next/link";
import {
  BookOpen,
  Trophy,
  Target,
  ShoppingBag,
  UserRound,
  MoreHorizontal,
} from "lucide-react";
import type { UserOut } from "@/lib/types";

type SidebarProps = {
  user: UserOut;
  activePath?: string;
};

export default function Sidebar({
  user,
  activePath = "/",
}: SidebarProps) {
  const items = [
    ["/", "LEARN", BookOpen],
    ["/leaderboard", "LEADERBOARDS", Trophy],
    ["#", "QUESTS", Target],
    ["#", "SHOP", ShoppingBag],
    ["/profile", "PROFILE", UserRound],
    ["#", "MORE", MoreHorizontal],
  ] as const;

  return (
    <aside className="duo-sidebar">
      <Link href="/" className="duo-logo">
        duolingo
      </Link>

      <nav className="side-nav">
        {items.map(([href, label, Icon]) => {
          const isActive =
            href === activePath ||
            (activePath === "/" && href === "/");

          return (
            <Link
              key={label}
              href={href}
              className={`side-link ${isActive ? "active" : ""}`}
            >
              <Icon size={31} strokeWidth={3} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="daily-card">
        <div className="daily-title">
          DAILY GOAL <span>🎯</span>
        </div>

        <div className="daily-value">
          {user.xp_today} / {user.daily_goal_xp} XP
        </div>

        <div className="daily-track">
          <div
            style={{
              width: `${Math.min(
                100,
                (user.xp_today /
                  Math.max(1, user.daily_goal_xp)) *
                  100
              )}%`,
            }}
          />
        </div>
      </div>
    </aside>
  );
}