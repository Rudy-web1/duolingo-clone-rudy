"use client";

import Link from "next/link";
import { BookOpen, Trophy, User, Settings, Flame, Zap, Gem, Heart } from "lucide-react";
import type { UserOut } from "@/lib/types";

export default function TopBar({
  user,
  courseFlag,
}: {
  user: UserOut;
  courseFlag?: string;
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[230px] bg-white border-r-2 border-[#E5E5E5] z-40 flex-col">
        <div className="px-7 pt-7 pb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="duo-logo-mark">D</div>
            <span className="text-2xl font-black tracking-tight text-[#58CC02]">
              duo
            </span>
          </Link>
        </div>

        <nav className="px-3 space-y-2">
          <NavItem
            href="/"
            icon={<BookOpen size={22} strokeWidth={3} />}
            label="Learn"
            active
          />

          <NavItem
            href="/leaderboard"
            icon={<Trophy size={22} strokeWidth={3} />}
            label="Leaderboard"
          />

          <NavItem
            href="/profile"
            icon={<User size={22} strokeWidth={3} />}
            label="Profile"
          />

          <NavItem
            href="#"
            icon={<Settings size={22} strokeWidth={3} />}
            label="Settings"
          />
        </nav>

        <div className="mt-auto p-5">
          <div className="rounded-2xl bg-[#F7F7F7] border-2 border-[#E5E5E5] p-4">
            <p className="text-xs font-black uppercase text-[#777]">
              Daily goal
            </p>

            <div className="flex items-center justify-between mt-2">
              <span className="font-black text-[#3C3C3C]">
                {user.xp_today} / {user.daily_goal_xp} XP
              </span>

              <span className="text-lg">🎯</span>
            </div>

            <div className="mt-3 h-2 rounded-full bg-[#E5E5E5] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#58CC02]"
                style={{
                  width: `${Math.min(
                    100,
                    (user.xp_today / user.daily_goal_xp) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile / top navigation */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b-2 border-[#E5E5E5]">
        <div className="h-[64px] px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="duo-logo-mark small">D</div>
            <span className="text-xl font-black text-[#58CC02]">duo</span>
          </Link>

          <Stats user={user} />
        </div>
      </header>

      {/* Desktop stats */}
      <div className="hidden lg:flex fixed top-0 right-0 left-[230px] h-[72px] bg-white/95 backdrop-blur-md border-b-2 border-[#E5E5E5] z-30 items-center justify-end px-10">
        <div className="flex items-center gap-3">
          <Stat
            icon={<Flame size={20} fill="#FF9600" />}
            value={user.streak_count}
            className="text-[#FF9600]"
          />

          <Stat
            icon={<Zap size={20} fill="#1CB0F6" />}
            value={user.xp_total}
            className="text-[#1CB0F6]"
          />

          <Stat
            icon={<Gem size={20} fill="#CE82FF" />}
            value={user.gems}
            className="text-[#CE82FF]"
          />

          <Stat
            icon={<Heart size={20} fill="#FF4B4B" />}
            value={user.hearts}
            className="text-[#FF4B4B]"
          />

          <Link
            href="/profile"
            className="ml-2 w-10 h-10 rounded-full flex items-center justify-center text-white font-black border-2 border-white shadow-sm hover:scale-105 transition-transform"
            style={{ backgroundColor: user.avatar_color }}
          >
            {user.display_name.charAt(0).toUpperCase()}
          </Link>
        </div>
      </div>
    </>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-4 px-5 py-3.5 rounded-xl font-black transition-all",
        active
          ? "bg-[#E7F9D9] text-[#58A700] border-2 border-[#58CC02]"
          : "text-[#777] hover:bg-[#F7F7F7] hover:text-[#3C3C3C]",
      ].join(" ")}
    >
      {icon}
      {label}
    </Link>
  );
}

function Stat({
  icon,
  value,
  className,
}: {
  icon: React.ReactNode;
  value: number;
  className: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 px-3 ${className}`}>
      {icon}
      <span className="font-black">{value}</span>
    </div>
  );
}

function Stats({ user }: { user: UserOut }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-black text-[#FF9600]">🔥 {user.streak_count}</span>
      <span className="font-black text-[#1CB0F6]">⚡ {user.xp_total}</span>
      <span className="font-black text-[#FF4B4B]">❤️ {user.hearts}</span>
    </div>
  );
}