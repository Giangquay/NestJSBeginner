import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],//Noi import module
  providers: [AppService],//Noi import service
})
export class AppModule {}
