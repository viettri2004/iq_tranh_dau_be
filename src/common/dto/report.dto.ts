import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class ReportDto {
  @IsInt()
  user_id!: number;

  @IsInt()
  question_id!: number;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
