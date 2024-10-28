import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from './app.module';

const protocol = process.env.PROTOCOL || 'http';
const host = process.env.API_HOST || 'localhost';
const port = process.env.PORT || 3001;
const apiVersion = process.env.API_PREFIX || 'api/v1';
const url = `${protocol}://${host}:${port}/${apiVersion}`;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set security-related HTTP headers
  app.use(helmet());
  // https://wanago.io/2024/02/12/api-nestjs-helmet-security/

  // Rules that helmet sets by default:

  // 1. Content-Security-Policy:
  //  default-src 'self';
  //  base-uri 'self';
  //  font-src 'self' https: data:;
  //  form-action 'self';
  //  frame-ancestors 'self';
  //  img-src 'self' data:;
  //  object-src 'none';
  //  script-src 'self';
  //  script-src-attr 'none';
  //  style-src 'self' https: 'unsafe-inline';
  //  upgrade-insecure-requests;

  //  Exp: script-src 'self' tells the browser not to load any scripts from origins different than the opened page.
  //  It also prevents all inline scripts and inline event handlers from running.

  // 2. Cross-Origin-Opener-Policy: same-origin
  // same-origin: isolates browsing context. The window.opener property is not available if both websites don’t have the same origin

  // 3. Cross-Origin-Resource-Policy: same-origin
  // cross-origin request - When a website requests resources from a different origin.
  // The same-origin policy allows a website to access data from another page only if both have the same origin.
  // However, same-origin policy doesn't prevent the browser from embedding resources from other origins.
  // Ex., it can display images using the <img> tag or play media using <video> even if they from other origins.
  // same-origin: Helmet disallows other origins from embedding our resources.

  // 4. Origin-Agent-Cluster: ?1
  // 5. Referrer-Policy: no-referrer
  // When a browser makes an HTTP request, it includes the page’s address in the Referer request header.
  // While it might be helpful for analytics, it might also lead to malicious tracking and leaking information.
  // no-referrer: ensures that browser removes the Referer header completely.

  // 6. Strict-Transport-Security: max-age=31536000; includeSubDomains
  // Whenever we visit a website using the HTTPS protocol, and the server responds with the Strict-Transport-Security header, the browser remembers it.
  // If we try accessing this site using HTTP, we’re automatically redirected to HTTPS instead.

  // 7. X-Content-Type-Options: nosniff
  // 8. X-DNS-Prefetch-Control: off
  // 9. X-Download-Options: noopen
  // 10. X-Frame-Options: SAMEORIGIN
  // 11. X-Permitted-Cross-Domain-Policies: none
  // 12. X-XSS-Protection: 0

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.setGlobalPrefix(apiVersion);

  app.enableCors({
    origin: [url],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: [
      'Accept',
      'Content-Type',
      'Origin',
      'Authorization',
      'X-Requested-With',
      'Referer',
      'Host',
    ],
  });

  // https://docs.nestjs.com/openapi/introduction
  // While the application is running, open your browser and navigate to http://localhost:3000/api/v1.
  // You should see the Swagger UI.

  const config = new DocumentBuilder()
    .setTitle('Rent24')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'jwt',
      },
      'jwt'
    )
    .setDescription('The rent24 API description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('user-profile')
    .addTag('agent-profile')
    .addTag('amenities')
    .addTag('wall-type')
    .addTag('activity-logs')
    .addTag('properties')
    .addTag('activities')
    .addServer(url)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(apiVersion, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Optional: keeps authorization details on reload
    },
  });

  await app.listen(port);
}
bootstrap();
