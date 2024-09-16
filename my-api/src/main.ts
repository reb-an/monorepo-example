import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // <origins> lists the urls that are allowed access to this api
  const origins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : [];

  //FIXME: instead of hardcoding some of my websites links here,
  //they should be added to the CORS_ORIGINS env var
  //FIXME: dont refer to localhost in code?
  app.enableCors({
    credentials: true,
    origin: [
      ...origins,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'https://mywebsitethattotallyisntliverightnow.com',
    ],
  });

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('my API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
