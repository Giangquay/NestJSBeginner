import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());//Sử dụng validate pipe toàn cục
  await app.listen(process.env.PORT||3002);
}
bootstrap();
