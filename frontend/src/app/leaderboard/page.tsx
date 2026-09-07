"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Medal, ArrowLeft, Sparkles } from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import { api } from "@/lib/api";
import type {
  LeaderboardEntry,
  UserOut,
} from "@/lib/types";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [entries, setEntries] =
    useState<LeaderboardEntry[] | null>(null);

  const [user, setUser] =
    useState<UserOut | null>(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    Promise.all([
      api.getLeaderboard(),
      api.getUser(),
    ])
      .then(([leaderboard, currentUser]) => {
        setEntries(leaderboard);
        setUser(currentUser);
      })
      .catch((err) => {
        setError(
          err?.message ||
            "Could not load leaderboard."
        );
      });
  }, []);

  if (error) {
    return (
      <AppShell>
        <main className="leaderboard-page">
          <div className="leaderboard-error-box">
            <div className="leaderboard-error-icon">
              ⚠️
            </div>

            <h2>
              Couldn't load leaderboard
            </h2>

            <p>{error}</p>

            <Link
              href="/"
              className="leaderboard-return-button"
            >
              <ArrowLeft size={17} />
              Back to learning
            </Link>
          </div>
        </main>
      </AppShell>
    );
  }

  if (!entries || !user) {
    return (
      <AppShell>
        <main className="leaderboard-page">
          <div className="leaderboard-loading">
            <div className="leaderboard-spinner" />
            <p>Loading leaderboard...</p>
          </div>
        </main>
      </AppShell>
    );
  }

  const currentEntry = entries.find(
    (entry) => entry.is_current_user
  );

  return (
    <AppShell>
      <main className="leaderboard-page">

        {/* HEADER */}

        <header className="leaderboard-page-header">

          <div>
            <div className="leaderboard-eyebrow">
              🏆 WEEKLY LEAGUE
            </div>

            <h1>
              Leaderboard
            </h1>

            <p>
              Compete with learners and climb the
              ranks with XP.
            </p>
          </div>

          <Link
            href="/"
            className="leaderboard-back-button"
          >
            <ArrowLeft size={17} />
            Learn
          </Link>

        </header>


        {/* LEAGUE HERO */}

        <section className="leaderboard-league-card">

          <div className="leaderboard-trophy">
            <Trophy
              size={34}
              strokeWidth={2.5}
            />
          </div>

          <div className="leaderboard-league-info">

            <span className="leaderboard-league-label">
              BRONZE LEAGUE
            </span>

            <h2>
              Keep climbing!
            </h2>

            <p>
              Earn XP by completing lessons and
              move up the leaderboard.
            </p>

          </div>

          <div className="leaderboard-your-xp">

            <span>
              YOUR XP
            </span>

            <strong>
              {user.xp_total}
            </strong>

            <small>
              XP
            </small>

          </div>

        </section>


        {/* YOUR POSITION */}

        {currentEntry && (
          <section className="leaderboard-position-card">

            <div className="leaderboard-position-left">

              <div className="leaderboard-position-icon">
                ⭐
              </div>

              <div>
                <span>
                  YOUR POSITION
                </span>

                <strong>
                  #{currentEntry.rank}
                </strong>
              </div>

            </div>

            <div className="leaderboard-position-xp">
              {user.xp_total} XP
            </div>

          </section>
        )}


        {/* RANKING */}

        <section className="leaderboard-ranking-card">

          <div className="leaderboard-ranking-header">

            <div>
              <h2>
                This week
              </h2>

              <p>
                Top learners by total XP
              </p>
            </div>

            <div className="leaderboard-live">
              <span>●</span>
              LIVE
            </div>

          </div>


          <div className="leaderboard-list">

            {entries.map((entry) => {

              const medal =
                MEDALS[entry.rank - 1];

              return (
                <div
                  key={entry.user_id}
                  className={`leaderboard-row ${
                    entry.is_current_user
                      ? "is-you"
                      : ""
                  }`}
                >

                  <div className="leaderboard-rank">
                    {medal || entry.rank}
                  </div>


                  <div
                    className="leaderboard-avatar"
                    style={{
                      backgroundColor:
                        entry.avatar_color,
                    }}
                  >
                    {entry.display_name
                      .charAt(0)
                      .toUpperCase()}
                  </div>


                  <div className="leaderboard-name">

                    <strong>
                      {entry.display_name}
                    </strong>

                    {entry.is_current_user && (
                      <span>
                        YOU
                      </span>
                    )}

                  </div>


                  <div className="leaderboard-xp">

                    <strong>
                      {entry.xp_total}
                    </strong>

                    <span>
                      XP
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </section>


        {/* TIP */}

        <section className="leaderboard-tip">

          <div className="leaderboard-tip-icon">
            <Sparkles size={20} />
          </div>

          <div>
            <strong>
              Want to climb faster?
            </strong>

            <p>
              Complete lessons without mistakes
              to earn bonus XP and keep your
              streak going.
            </p>
          </div>

        </section>

      </main>
    </AppShell>
  );
}