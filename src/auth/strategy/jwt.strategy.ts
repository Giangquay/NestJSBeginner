import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserEntity } from "src/users/entities/user.entity";
import { Entity, Repository } from "typeorm";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(
        configService: ConfigService,
        @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>
        ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // ignoreExpiration:false,
            secretOrKey: configService.get('JWT_SECRET')
        }
        )
    }

    async validate(payload:{sub:string,email:string})
    {
        const user = await this.userRepository.findOneBy({id:payload.sub})
        delete user.salt;
        return user;
    }
}