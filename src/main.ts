import { JwtService } from '@nestjs/jwt';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { JwtSocketAdapter } from './common/guards/wt-socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET || 'secret', // ⚠️ Đảm bảo trùng với JWT config
    signOptions: { expiresIn: '1h' },
  });

  app.useWebSocketAdapter(new JwtSocketAdapter(app, jwtService));

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt-auth', // 🔑 this name must match in @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // ← đường dẫn đúng
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // loại bỏ field thừa
      forbidNonWhitelisted: true, // báo lỗi nếu có field không định nghĩa
      transform: true, // tự ép kiểu
    }),
  );

  app.listen(3000, '0.0.0.0');
  console.log(`Swagger UI`);
}
bootstrap();
