import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
    @ApiProperty({
        description: 'ID Token từ Google sau khi người dùng đăng nhập',
        example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2ZTg3NjM1OTg3ZTQ3YjM5NjYzMjU5NmM4NzNkYTAzMmUyNmMyNmMiLCJ0eXAiOiJKV1QifQ...',
    })
    @IsNotEmpty()
    @IsString()
    idToken!: string;
}
