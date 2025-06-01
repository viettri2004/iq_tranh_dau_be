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
      const contents = `Bạn là một chuyên gia giáo dục. Hãy tạo ra một bộ ${total} câu hỏi trắc nghiệm về chủ đề "${category}" với định dạng JSON chuẩn. Mỗi câu hỏi phải có các trường sau:

- "id": số nguyên duy nhất cho mỗi câu hỏi.
- "question": nội dung câu hỏi, rõ ràng và dễ hiểu.
- "options": một mảng chứa đúng 4 lựa chọn dạng chuỗi (ví dụ: ["Lựa chọn 1", "Lựa chọn 2", "Lựa chọn 3", "Lựa chọn 4"]), **không có đánh dấu a, b, c, d**.
- "correctAnswer": một chuỗi, phải **giống chính xác một trong các phần tử trong "options"**, là đáp án đúng.

Yêu cầu:
- Các câu hỏi phải ngắn gọn, chính xác, phù hợp với người học phổ thông hoặc đại trà.
- Các lựa chọn sai phải hợp lý và gây nhiễu.
- Không chèn giải thích hoặc mô tả ngoài các trường đã nêu.

Trả kết quả là một mảng JSON các đối tượng câu hỏi.`;

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
