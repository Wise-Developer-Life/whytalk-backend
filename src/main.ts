import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ScriptService } from './script/script.service';

function setUpSwaggerInApp(path: string, app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Chat API')
    .setDescription('Chat API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setUpSwaggerInApp('api', app);

  // TODO: remove this in the future
  const scriptService = app.get(ScriptService);
  await scriptService.runScript();

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
