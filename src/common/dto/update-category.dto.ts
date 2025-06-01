import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục mới để cập nhật',
    example: 'Lịch sử nâng cao',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
