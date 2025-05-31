import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean } from 'class-validator';

export class CreateMatchAnswerDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  matchId!: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  userId!: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  questionId!: number;

  @ApiProperty({ example: 'C' })
  @IsString()
  selectedOption!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCorrect!: boolean;
}
