"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { ProfileResponse } from "@/lib/types";

export default function ProfilePage() {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    api.getProfile().then(setData);
  }, []);

  if (!data) {
    return (
      <main className="profile-page profile-loading">
        <div className="profile-spinner" />
        <p>Loading profile...</p>
      </main>
    );
  }

  const {
    user,
    total_lessons_completed,
    skills_completed,
    achievements,
  } = data;

  return (
    <main className="profile-page">

      {/* =====================================================
          PROFILE HEADER
          ===================================================== */}

      <header className="profile-header">

        <div className="profile-header-inner">

          <Link href="/" className="profile-back">
            ←
          </Link>

          <div className="profile-header-title">
            <span>LEARNER PROFILE</span>
            <h1>Profile</h1>
          </div>

          <button
            className="profile-more-button"
            onClick={() => setShowMore((value) => !value)}
            aria-label="More profile options"
          >
            •••
          </button>

          {showMore && (
            <div className="profile-more-menu">

              <button>
                ⚙️ Settings
              </button>

              <button>
                🔔 Notifications
              </button>

              <button>
                🔊 Audio
              </button>

              <div className="profile-menu-divider" />

              <button>
                🚧 More coming soon
              </button>

            </div>
          )}

        </div>

      </header>

      <div className="profile-container">

        {/* =================================================
            HERO PROFILE
            ================================================= */}

        <section className="profile-hero">

          <div className="profile-avatar-wrapper">

            <button
              className="profile-avatar"
              style={{
                backgroundColor: user.avatar_color,
              }}
              onClick={() => setShowAvatarPicker(true)}
              aria-label="Change avatar"
            >
              {user.display_name
                .charAt(0)
                .toUpperCase()}

              <span className="avatar-edit">
                ✎
              </span>
            </button>

            <div className="profile-online-dot" />

          </div>

          <div className="profile-identity">

            <div className="profile-name-row">

              <h2>
                {user.display_name}
              </h2>

              <span className="profile-level-badge">
                🇪🇸 Spanish learner
              </span>

            </div>

            <p className="profile-username">
              @{user.username}
            </p>

            <p className="profile-member-text">
              Keep learning. Keep growing. 🚀
            </p>

          </div>

          <div className="profile-hero-streak">

            <span className="profile-streak-icon">
              🔥
            </span>

            <strong>
              {user.streak_count}
            </strong>

            <span>
              day streak
            </span>

          </div>

        </section>

        {/* =================================================
            QUICK STATS
            ================================================= */}

        <section className="profile-stats">

          <StatCard
            icon="⚡"
            value={user.xp_total}
            label="Total XP"
            accent="gold"
          />

          <StatCard
            icon="🔥"
            value={user.streak_count}
            label="Day streak"
            accent="orange"
          />

          <StatCard
            icon="📚"
            value={total_lessons_completed}
            label="Lessons done"
            accent="blue"
          />

          <StatCard
            icon="👑"
            value={skills_completed}
            label="Skills mastered"
            accent="purple"
          />

        </section>

        {/* =================================================
            LEARNING SUMMARY
            ================================================= */}

        <section className="profile-learning-card">

          <div className="profile-section-heading">

            <div>
              <span className="profile-section-kicker">
                YOUR JOURNEY
              </span>

              <h3>
                Learning progress
              </h3>
            </div>

            <Link
              href="/"
              className="profile-action-link"
            >
              VIEW PATH →
            </Link>

          </div>

          <div className="profile-learning-grid">

            <div className="profile-learning-item">

              <span className="learning-item-icon">
                🇪🇸
              </span>

              <div>
                <strong>
                  Spanish
                </strong>

                <span>
                  Current course
                </span>
              </div>

            </div>

            <div className="profile-learning-item">

              <span className="learning-item-icon">
                🎯
              </span>

              <div>
                <strong>
                  {user.xp_today} XP
                </strong>

                <span>
                  Today's XP
                </span>
              </div>

            </div>

            <div className="profile-learning-item">

              <span className="learning-item-icon">
                💎
              </span>

              <div>
                <strong>
                  {user.gems}
                </strong>

                <span>
                  Gems available
                </span>
              </div>

            </div>

            <div className="profile-learning-item">

              <span className="learning-item-icon">
                ❤️
              </span>

              <div>
                <strong>
                  {user.hearts}/{user.max_hearts}
                </strong>

                <span>
                  Hearts
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            ACHIEVEMENTS
            ================================================= */}

        <section className="profile-achievements">

          <div className="profile-section-heading">

            <div>
              <span className="profile-section-kicker">
                MILESTONES
              </span>

              <h3>
                Achievements
              </h3>
            </div>

            <span className="achievement-count">
              {achievements.filter((a) => a.earned).length}
              {" / "}
              {achievements.length}
            </span>

          </div>

          <div className="achievement-grid">

            {achievements.map((achievement) => (

              <div
                key={achievement.code}
                className={`achievement-card ${
                  achievement.earned
                    ? "achievement-earned"
                    : "achievement-locked"
                }`}
              >

                <div className="achievement-icon">
                  {achievement.icon}
                </div>

                <div className="achievement-content">

                  <strong>
                    {achievement.title}
                  </strong>

                  <span>
                    {achievement.description}
                  </span>

                </div>

                {achievement.earned && (
                  <div className="achievement-check">
                    ✓
                  </div>
                )}

              </div>

            ))}

          </div>

        </section>

        {/* =================================================
            SETTINGS
            ================================================= */}

        <section className="profile-settings">

          <div className="profile-section-heading">

            <div>
              <span className="profile-section-kicker">
                CUSTOMIZE
              </span>

              <h3>
                Settings
              </h3>
            </div>

          </div>

          <div className="settings-list">

            <SettingRow
              icon="👤"
              title="Account"
              description="Profile and account preferences"
            />

            <SettingRow
              icon="🔔"
              title="Notifications"
              description="Manage learning reminders"
            />

            <SettingRow
              icon="🔊"
              title="Audio"
              description="Sound and pronunciation preferences"
            />

            <SettingRow
              icon="🌙"
              title="Appearance"
              description="Theme and display preferences"
            />

          </div>

        </section>

        {/* =================================================
            FOOTER
            ================================================= */}

        <div className="profile-footer">
          <span>Keep your streak alive 🔥</span>
          <Link href="/">
            Back to learning →
          </Link>
        </div>

      </div>

      {/* =====================================================
          AVATAR PICKER
          ===================================================== */}

      {showAvatarPicker && (
        <div
          className="profile-modal-overlay"
          onClick={() => setShowAvatarPicker(false)}
        >

          <div
            className="avatar-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setShowAvatarPicker(false)}
            >
              ×
            </button>

            <div className="avatar-modal-icon">
              👤
            </div>

            <h3>
              Change your avatar
            </h3>

            <p>
              Avatar customization is coming soon.
            </p>

            <button
              className="avatar-modal-button"
              onClick={() => setShowAvatarPicker(false)}
            >
              GOT IT
            </button>

          </div>

        </div>
      )}

    </main>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: string;
  value: number;
  label: string;
  accent: "gold" | "orange" | "blue" | "purple";
}) {
  return (
    <div className={`profile-stat-card stat-${accent}`}>

      <div className="profile-stat-icon">
        {icon}
      </div>

      <div className="profile-stat-value">
        {value}
      </div>

      <div className="profile-stat-label">
        {label}
      </div>

    </div>
  );
}

/* =========================================================
   SETTINGS ROW
   ========================================================= */

function SettingRow({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <button className="settings-row">

      <span className="settings-icon">
        {icon}
      </span>

      <span className="settings-copy">

        <strong>
          {title}
        </strong>

        <small>
          {description}
        </small>

      </span>

      <span className="settings-arrow">
        ›
      </span>

    </button>
  );
}