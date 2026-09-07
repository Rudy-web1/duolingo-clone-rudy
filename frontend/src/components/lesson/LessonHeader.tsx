"use client";

import { useRouter } from "next/navigation";

export default function LessonHeader({
  progress,
  hearts,
  current,
  total,
}: {
  progress: number; // 0..1
  hearts: number;
  current: number;
  total: number;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 px-4 py-4 max-w-2xl mx-auto w-full">
      <button
        onClick={() => router.push("/")}
        aria-label="Exit lesson"
        className="text-duo-grayDark hover:text-duo-text text-2xl leading-none font-bold"
      >
        ✕
      </button>

      <div className="flex-1 h-4 rounded-full bg-duo-gray overflow-hidden">
        <div
          className="h-full bg-duo-green rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(
              100,
              Math.max(4, progress * 100)
            )}%`,
          }}
        />
      </div>

      <span className="text-sm font-extrabold text-duo-grayDark whitespace-nowrap">
        {current}/{total}
      </span>

      <div className="flex items-center gap-1 font-extrabold text-duo-red min-w-[48px] justify-end">
        <span className="text-xl">❤️</span>
        <span>{hearts}</span>
      </div>
    </div>
  );
}