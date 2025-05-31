export interface SubmittedAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  correctAnswer: string;
}
