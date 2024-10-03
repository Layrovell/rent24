import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

const protocol = process.env.PROTOCOL || 'http';
const host = process.env.API_HOST || 'localhost';
const port = process.env.PORT || 3001;
const apiVersion = process.env.API_PREFIX || 'api/v1';
const url = `${protocol}://${host}:${port}/${apiVersion}`;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // https://docs.nestjs.com/openapi/introduction
  // While the application is running, open your browser and navigate to http://localhost:3000/api/v1.
  // You should see the Swagger UI.

  const config = new DocumentBuilder()
    .setTitle('Rent24')
    .setDescription('The rent24 API description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addServer(url)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(apiVersion, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Optional: keeps authorization details on reload
    },
  });

  // app use global pipes to automatically validate requests
  // from entity itself such as:
  /*
    @MinLength(6, { message: 'Password cannot be less then 6 characters' })
    @IsString()
    password: string;
  */
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(apiVersion);

  app.enableCors({
    origin: [url],
    allowedHeaders: [
      'Accept',
      'Content-Type',
      'Origin',
      'api_key',
      'authorization',
      'x-requested-with',
      'Access-Control-Allow-Origin',
      'Referer',
      'Host',
    ],
  });

  await app.listen(port);
}
bootstrap();
