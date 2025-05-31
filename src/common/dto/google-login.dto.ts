import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({
    description:
      'Google ID Token trả về sau khi người dùng đăng nhập bằng Google',
  })
  @IsString()
  idToken!: string;
}
