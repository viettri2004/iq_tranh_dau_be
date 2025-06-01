import { IsEnum, IsNotEmpty } from 'class-validator';

export enum InstrumentEnum {
  IMAGE_PROMPT = 'IMAGE_PROMPT',
  TEXT_PROMPT = 'TEXT_PROMPT',
  SEARCH_PROMPT = 'SEARCH_PROMPT',
}

export class GeneratePromptDto {
  @IsNotEmpty()
  userInput!: string;

  @IsEnum(InstrumentEnum)
  instrument!: InstrumentEnum;
}
