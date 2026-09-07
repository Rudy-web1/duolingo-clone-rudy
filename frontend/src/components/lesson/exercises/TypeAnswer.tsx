"use client";

import { Keyboard } from "lucide-react";
import { useState } from "react";
import type { ExerciseOut } from "@/lib/types";

export default function TypeAnswer({
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
  const [text, setText] = useState("");

  return (
    <div className="exercise-card">
      <div className="exercise-type">TYPE YOUR ANSWER</div>

      <h2 className="exercise-question">
        {exercise.prompt}
      </h2>

      <p className="exercise-helper">
        Type the correct answer below
      </p>

      <div
        className={`type-answer-wrap ${
          result
            ? result.correct
              ? "type-correct"
              : "type-wrong"
            : ""
        }`}
      >
        <input
          type="text"
          value={text}
          disabled={locked}
          autoFocus
          placeholder="Type your answer..."
          onChange={(e) => {
            setText(e.target.value);
            onAnswerChange(
              e.target.value.trim()
                ? e.target.value
                : null
            );
          }}
        />

        <Keyboard size={22} />
      </div>

      {result && !result.correct && (
        <div className="exercise-correct-answer">
          Correct answer:{" "}
          <strong>{result.correct_answer}</strong>
        </div>
      )}
    </div>
  );
}