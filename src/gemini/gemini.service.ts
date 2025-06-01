import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import { QuizQuestion } from 'src/common/types/quiz-question.interface';

dotenv.config();
const QuizQuestionSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    question: { type: 'string' },
    options: {
      type: 'array',
      items: { type: 'string' },
    },
    correctAnswer: { type: 'string' },
  },
  required: ['id', 'question', 'options', 'correctAnswer'],
};

@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing');
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateQuizQuestion(
    category: string,
    total: number,
  ): Promise<QuizQuestion[]> {
    try {
      const config = {
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'array',
          items: QuizQuestionSchema,
        },
      };
      const model = 'gemini-1.5-flash';
      const contents = `Bạn là một chuyên gia giáo dục. Hãy tạo ra một bộ ${total} câu hỏi trắc nghiệm về chủ đề "${category}", dưới định dạng JSON chuẩn gồm các trường: id, question, options, correctAnswer.`;

      const response = await this.ai.models.generateContent({
        model,
        config,
        contents,
      });

      if (!response.text) {
        console.error('Gemini response is empty:', response);
        throw new InternalServerErrorException(
          'Phản hồi từ Gemini không có nội dung',
        );
      }

      const text: string = response.text;
      const data: QuizQuestion[] = JSON.parse(text);
      return data;
    } catch (error) {
      console.error('Gemini Error:', error);
      throw new InternalServerErrorException('Lỗi khi tạo prompt');
    }
  }
}
