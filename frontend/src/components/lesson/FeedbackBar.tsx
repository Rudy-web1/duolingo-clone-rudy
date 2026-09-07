"use client";

export default function FeedbackBar({
  correct, correctAnswerText, onContinue,
}: {
  correct: boolean;
  correctAnswerText?: string;
  onContinue: () => void;
}) {
  return (
    <div
      className={[
        "fixed bottom-0 left-0 right-0 z-40 border-t-2 animate-slideUp",
        correct ? "bg-[#D7FFB8] border-duo-green" : "bg-[#FFDFE0] border-duo-red",
      ].join(" ")}
    >
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{correct ? "✅" : "❌"}</span>
          <div>
            <p className={`font-extrabold text-lg ${correct ? "text-duo-greenDark" : "text-duo-redDark"}`}>
              {correct ? "Nice!" : "Correct solution:"}
            </p>
            {!correct && correctAnswerText && (
              <p className="text-duo-redDark font-semibold text-sm">{correctAnswerText}</p>
            )}
          </div>
        </div>

        <button
          onClick={onContinue}
          className={correct ? "duo-btn-green" : "duo-btn-red"}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
