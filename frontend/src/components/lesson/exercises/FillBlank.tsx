"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import type { ExerciseOut } from "@/lib/types";

export default function FillBlank({
  exercise,
  onAnswerChange,
  locked,
  result,
}: {
  exercise: ExerciseOut;
  onAnswerChange: (answer: string | null) => void;
  locked: boolean;
  result: { correct: boolean; correct_answer: any } | null;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const options: string[] = exercise.data.options || [];
  const [before, after] = exercise.prompt.split("___");

  const pick = (opt: string) => {
    if (locked) return;

    setSelected(opt);
    onAnswerChange(opt);
  };

  return (
    <div className="exercise-card">
      <div className="exercise-type">FILL IN THE BLANK</div>

      <h2 className="exercise-question">
        Complete the sentence
      </h2>

      <div className="fill-sentence">
        {before}

        <span
          className={`fill-answer ${
            result
              ? result.correct
                ? "fill-correct"
                : "fill-wrong"
              : selected
                ? "fill-selected"
                : ""
          }`}
        >
          {selected || "____"}
        </span>

        {after}
      </div>

      <p className="exercise-helper">
        Select the missing word
      </p>

      <div className="choice-grid">
        {options.map((opt, index) => {
          let state = "";

          if (result) {
            if (opt === result.correct_answer) {
              state = "choice-correct";
            } else if (opt === selected && !result.correct) {
              state = "choice-wrong";
            }
          } else if (opt === selected) {
            state = "choice-selected";
          }

          return (
            <button
              key={opt}
              disabled={locked}
              onClick={() => pick(opt)}
              className={`choice-button ${state}`}
            >
              <span className="choice-letter">
                {String.fromCharCode(65 + index)}
              </span>

              <span className="choice-text">
                {opt}
              </span>

              {result && opt === result.correct_answer && (
                <Check size={20} strokeWidth={3} />
              )}

              {result &&
                opt === selected &&
                !result.correct &&
                opt !== result.correct_answer && (
                  <X size={20} strokeWidth={3} />
                )}
            </button>
          );
        })}
      </div>
    </div>
  );
}