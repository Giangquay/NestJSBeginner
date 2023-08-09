import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy';


@Module({
    imports:[JwtModule.register({}),
        TypeOrmModule.forFeature([UserEntity]),
        ConfigModule.forRoot()
    ],//dang ky
    controllers:[AuthController],
    providers:[AuthService,JwtStrategy]
})
export class AuthModule {

}
