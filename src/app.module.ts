import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Users} from './users/entities/user.entity'
import { UsersModule } from "./users/users.module";
import { PostinfoModule } from './postinfo/postinfo.module';
import { typeOrmConfigAsync } from './configs/typeorm.config';
@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    UsersModule,
    PostinfoModule,
    ConfigModule.forRoot()//Khoi dong @nestjs/config
  ],
  controllers: [AppController],//Noi import module
  providers: [AppService],//Noi import service
})
export class AppModule {}
