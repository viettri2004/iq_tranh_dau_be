// question.dto.ts
import { IsString, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionDto {
  @IsNumber()
  id!: number;

  @IsString()
  question!: string;

  @IsArray()
  @IsString({ each: true })
  options!: string[];

  @IsString()
  correctAnswer!: string;
}

export class StartMatchDto {
  @IsArray()
  @Type(() => QuestionDto)
  questions!: QuestionDto[];
}
