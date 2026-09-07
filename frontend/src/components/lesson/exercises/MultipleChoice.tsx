"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import type { ExerciseOut } from "@/lib/types";

export default function MultipleChoice({
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

  const pick = (opt: string) => {
    if (locked) return;
    setSelected(opt);
    onAnswerChange(opt);
  };

  return (
    <div className="exercise-card">
      <div className="exercise-type">MULTIPLE CHOICE</div>

      <h2 className="exercise-question">
        {exercise.prompt}
      </h2>

      <p className="exercise-helper">
        Choose the best answer
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
                <span className="choice-result-icon">
                  <Check size={20} strokeWidth={3} />
                </span>
              )}

              {result &&
                opt === selected &&
                !result.correct &&
                opt !== result.correct_answer && (
                  <span className="choice-result-icon">
                    <X size={20} strokeWidth={3} />
                  </span>
                )}
            </button>
          );
        })}
      </div>
    </div>
  );
}