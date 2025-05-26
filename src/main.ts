import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // ← đường dẫn đúng
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              // loại bỏ field thừa
    forbidNonWhitelisted: true,   // báo lỗi nếu có field không định nghĩa
    // transform: true,              // tự ép kiểu
  }));
  await app.listen(3000);
  console.log(`Swagger UI: http://localhost:3000/api-docs`);
}
bootstrap();
