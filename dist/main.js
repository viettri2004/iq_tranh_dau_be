"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const wt_socket_adapter_1 = require("./common/guards/wt-socket.adapter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    const jwtService = new jwt_1.JwtService({
        secret: process.env.JWT_SECRET || 'secret',
        signOptions: { expiresIn: '1h' },
    });
    app.useWebSocketAdapter(new wt_socket_adapter_1.JwtSocketAdapter(app, jwtService));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('My API')
        .setDescription('API description')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
    }, 'jwt-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.listen(3000, '0.0.0.0');
    console.log(`Swagger UI`);
}
bootstrap();
//# sourceMappingURL=main.js.map