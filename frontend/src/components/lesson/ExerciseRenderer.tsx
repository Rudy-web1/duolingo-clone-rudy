"use client";

import type { ExerciseOut, AnswerResult } from "@/lib/types";
import MultipleChoice from "./exercises/MultipleChoice";
import Translate from "./exercises/Translate";
import MatchPairs from "./exercises/MatchPairs";
import FillBlank from "./exercises/FillBlank";
import TypeAnswer from "./exercises/TypeAnswer";

export default function ExerciseRenderer({
  exercise, onAnswerChange, locked, result,
}: {
  exercise: ExerciseOut;
  onAnswerChange: (answer: any) => void;
  locked: boolean;
  result: AnswerResult | null;
}) {
  switch (exercise.type) {
    case "multiple_choice":
      return <MultipleChoice exercise={exercise} onAnswerChange={onAnswerChange} locked={locked} result={result} />;
    case "translate":
      return <Translate exercise={exercise} onAnswerChange={onAnswerChange} locked={locked} result={result} />;
    case "match_pairs":
      return <MatchPairs exercise={exercise} onAnswerChange={onAnswerChange} locked={locked} result={result} />;
    case "fill_blank":
      return <FillBlank exercise={exercise} onAnswerChange={onAnswerChange} locked={locked} result={result} />;
    case "type_answer":
      return <TypeAnswer exercise={exercise} onAnswerChange={onAnswerChange} locked={locked} result={result} />;
    default:
      return <p>Unsupported exercise type: {exercise.type}</p>;
  }
}
