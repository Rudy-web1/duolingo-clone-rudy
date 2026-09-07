"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { ExerciseOut } from "@/lib/types";

interface Tile {
  word: string;
  usedAt: number | null;
}

export default function Translate({
  exercise,
  onAnswerChange,
  locked,
  result,
}: {
  exercise: ExerciseOut;
  onAnswerChange: (answer: string[] | null) => void;
  locked: boolean;
  result: { correct: boolean; correct_answer: any } | null;
}) {
  const wordBank: string[] = exercise.data.word_bank || [];

  const [tiles, setTiles] = useState<Tile[]>(
    () => wordBank.map((w) => ({ word: w, usedAt: null }))
  );

  const selected = useMemo(
    () =>
      tiles
        .filter((t) => t.usedAt !== null)
        .sort((a, b) => a.usedAt! - b.usedAt!),
    [tiles]
  );

  const emit = (next: Tile[]) => {
    const words = next
      .filter((t) => t.usedAt !== null)
      .sort((a, b) => a.usedAt! - b.usedAt!)
      .map((t) => t.word);

    onAnswerChange(words.length > 0 ? words : null);
  };

  const tapBank = (idx: number) => {
    if (locked || tiles[idx].usedAt !== null) return;

    const nextOrder =
      Math.max(0, ...tiles.map((t) => t.usedAt ?? -1)) + 1;

    const next = tiles.map((t, i) =>
      i === idx ? { ...t, usedAt: nextOrder } : t
    );

    setTiles(next);
    emit(next);
  };

  const tapSelected = (idx: number) => {
    if (locked) return;

    const next = tiles.map((t, i) =>
      i === idx ? { ...t, usedAt: null } : t
    );

    setTiles(next);
    emit(next);
  };

  const reset = () => {
    if (locked) return;

    const next = tiles.map((t) => ({
      ...t,
      usedAt: null,
    }));

    setTiles(next);
    onAnswerChange(null);
  };

  return (
    <div className="exercise-card">
      <div className="exercise-type">TRANSLATE</div>

      <h2 className="exercise-question">
        {exercise.prompt}
      </h2>

      <p className="exercise-helper">
        Tap the words in the correct order
      </p>

      <div
        className={`translation-answer ${
          result
            ? result.correct
              ? "translation-correct"
              : "translation-wrong"
            : ""
        }`}
      >
        {selected.length === 0 ? (
          <span className="translation-placeholder">
            Tap words below to build your answer
          </span>
        ) : (
          selected.map((tile) => {
            const idx = tiles.indexOf(tile);

            return (
              <button
                key={idx}
                disabled={locked}
                onClick={() => tapSelected(idx)}
                className="word-tile word-tile-selected"
              >
                {tile.word}
              </button>
            );
          })
        )}
      </div>

      <div className="word-bank">
        {tiles.map((tile, idx) =>
          tile.usedAt === null ? (
            <button
              key={idx}
              disabled={locked}
              onClick={() => tapBank(idx)}
              className="word-tile"
            >
              {tile.word}
            </button>
          ) : (
            <span
              key={idx}
              className="word-tile-placeholder"
            />
          )
        )}
      </div>

      {!locked && selected.length > 0 && (
        <button
          className="translation-reset"
          onClick={reset}
        >
          <RotateCcw size={15} />
          Reset
        </button>
      )}

      {result && !result.correct && (
        <div className="exercise-correct-answer">
          Correct answer:{" "}
          <strong>
            {(result.correct_answer as string[]).join(" ")}
          </strong>
        </div>
      )}
    </div>
  );
}