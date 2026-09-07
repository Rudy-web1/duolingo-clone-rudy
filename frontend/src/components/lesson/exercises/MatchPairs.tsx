"use client";

import { useMemo, useState } from "react";
import type { ExerciseOut } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchPairs({
  exercise, onAnswerChange, locked,
}: {
  exercise: ExerciseOut;
  onAnswerChange: (answer: Record<string, string> | null) => void;
  locked: boolean;
  result: { correct: boolean; correct_answer: any } | null;
}) {
  const pairs: [string, string][] = exercise.data.pairs || [];
  const leftItems = useMemo(() => shuffle(pairs.map((p) => p[0])), [exercise.id]);
  const rightItems = useMemo(() => shuffle(pairs.map((p) => p[1])), [exercise.id]);
  const correctMap = useMemo(() => Object.fromEntries(pairs), [pairs]);

  const [matched, setMatched] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState<string | null>(null);

  const matchedRightValues = new Set(Object.values(matched));

  const tryMatch = (left: string | null, right: string | null) => {
    if (!left || !right) return;
    if (correctMap[left] === right) {
      const next = { ...matched, [left]: right };
      setMatched(next);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (Object.keys(next).length === pairs.length) {
        onAnswerChange(next);
      }
    } else {
      setShakeKey(`${left}|${right}`);
      setTimeout(() => {
        setShakeKey(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 350);
    }
  };

  const clickLeft = (word: string) => {
    if (locked || matched[word]) return;
    setSelectedLeft(word);
    tryMatch(word, selectedRight);
  };
  const clickRight = (word: string) => {
    if (locked || matchedRightValues.has(word)) return;
    setSelectedRight(word);
    tryMatch(selectedLeft, word);
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-extrabold text-duo-text mb-8">{exercise.prompt}</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {leftItems.map((word) => {
            const isMatched = !!matched[word];
            const isSelected = selectedLeft === word;
            const isShaking = shakeKey?.startsWith(`${word}|`);
            return (
              <button
                key={word}
                disabled={locked || isMatched}
                onClick={() => clickLeft(word)}
                className={[
                  "duo-card border-2 px-3 py-3 font-bold text-sm sm:text-base transition-colors",
                  isMatched ? "border-duo-green bg-[#D7FFB8] opacity-60" :
                  isSelected ? "border-duo-blue bg-[#DDF4FF]" : "border-duo-gray hover:border-duo-grayDark",
                  isShaking ? "animate-shake border-duo-red" : "",
                ].join(" ")}
              >
                {word}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rightItems.map((word) => {
            const isMatched = matchedRightValues.has(word);
            const isSelected = selectedRight === word;
            const isShaking = shakeKey?.endsWith(`|${word}`);
            return (
              <button
                key={word}
                disabled={locked || isMatched}
                onClick={() => clickRight(word)}
                className={[
                  "duo-card border-2 px-3 py-3 font-bold text-sm sm:text-base transition-colors",
                  isMatched ? "border-duo-green bg-[#D7FFB8] opacity-60" :
                  isSelected ? "border-duo-blue bg-[#DDF4FF]" : "border-duo-gray hover:border-duo-grayDark",
                  isShaking ? "animate-shake border-duo-red" : "",
                ].join(" ")}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
