import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục cần tạo',
    example: 'Khoa học',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
