import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtPayload } from './auth/auth.type';
import { AuthService } from './auth/auth.service';

function setUpSwaggerInApp(path: string, app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Chat API')
    .setDescription('Chat API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
}

//TODO: remove this in the future
async function generateTestingTokens(authService: AuthService) {
  const users: JwtPayload[] = [
    {
      email: 'taya87136@gmail.com',
    },
    {
      email: 'taya30621@gmail.com',
    },
    {
      email: 'taya5566@gmail.com',
    },
  ];

  const tokens = await Promise.all(
    users.map((user) => authService.generateJwtToken(user)),
  );

  tokens.forEach((token) => Logger.log(`[Testing] token: ${token}`));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setUpSwaggerInApp('api', app);

  // TODO: remove this in the future
  const authService = app.get(AuthService);
  await generateTestingTokens(authService);

  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('APP_PORT');
  await app.listen(appPort);
  Logger.log(
    `Server running on http://localhost:${appPort}`,
    'NestApplication',
  );
  Logger.log(
    `Swagger UI is available on http://localhost:${appPort}/api`,
    'SwaggerModule',
  );
}
bootstrap();
