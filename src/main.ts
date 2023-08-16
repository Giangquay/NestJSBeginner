import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(bodyParser.json({ limit: '10mb' }));
  // app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  // app.use(bodyParser.raw({ limit: '10mb' }));
  app.useGlobalPipes(new ValidationPipe());//Sử dụng validate pipe toàn cục
  await app.listen(process.env.PORT||3006);
}
bootstrap();
