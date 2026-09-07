"use client";

import { Check, X, ArrowRight } from "lucide-react";

export default function FeedbackBar({
  correct,
  correctAnswerText,
  onContinue,
}: {
  correct: boolean;
  correctAnswerText?: string;
  onContinue: () => void;
}) {
  return (
    <div
      className={`lesson-feedback ${
        correct ? "lesson-feedback-correct" : "lesson-feedback-wrong"
      }`}
    >
      <div className="lesson-feedback-inner">
        <div className="feedback-message">
          <div
            className={`feedback-icon ${
              correct ? "feedback-icon-correct" : "feedback-icon-wrong"
            }`}
          >
            {correct ? (
              <Check size={30} strokeWidth={4} />
            ) : (
              <X size={30} strokeWidth={4} />
            )}
          </div>

          <div>
            <div className="feedback-title">
              {correct ? "Excellent!" : "Not quite"}
            </div>

            {!correct && correctAnswerText && (
              <div className="feedback-answer">
                Correct answer:{" "}
                <strong>{correctAnswerText}</strong>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onContinue}
          className={`feedback-continue ${
            correct
              ? "feedback-continue-correct"
              : "feedback-continue-wrong"
          }`}
        >
          Continue
          <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}