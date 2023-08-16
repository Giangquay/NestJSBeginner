import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports:[JwtModule.register({
    }),//register jwt
        TypeOrmModule.forFeature([UserEntity]),//allow Feature user
        ConfigModule.forRoot()//allow config
    ],//Them cac thu vien khac vao de su dung 
    controllers:[AuthController],
    providers:[AuthService,JwtStrategy]//khoi tao cac provide cho controller
})
export class AuthModule {

}
