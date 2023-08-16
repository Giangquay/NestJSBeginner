import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from "./users/users.module";
import { PostinfoModule } from './postinfo/postinfo.module';
import { typeOrmConfigAsync } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    UsersModule,
    PostinfoModule,
    ConfigModule.forRoot({isGlobal: true,}),
    AuthModule//Khoi dong @nestjs/config,
   ,MulterModule.register(
    {
      storage: memoryStorage()
    }
   )
  ],
  controllers: [AppController],//Noi import module
  providers: [AppService],//Noi import service
})
export class AppModule {}
