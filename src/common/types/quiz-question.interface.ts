// src/common/dto/quiz-question.dto.ts
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}
