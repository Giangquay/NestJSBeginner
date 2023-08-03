import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Users} from './users/entities/user.entity'
import { UsersModule } from "./users/users.module";
import { PostinfoModule } from './postinfo/postinfo.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        password: '123456',
        username: 'postgres',
        entities: ['dist/**/*.entity.js'],
        database: 'TableTest',
        synchronize: true,
        logging: true,
    }),
    UsersModule,
    PostinfoModule,
  ],
  controllers: [AppController],//Noi import module
  providers: [AppService],//Noi import service
})
export class AppModule {}
