import { Injectable,ForbiddenException ,Req} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService,@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
        ,private configService:ConfigService){

    }

    async register(createUserDto: CreateUserDto){ 
        const user: UserEntity = new UserEntity();
        user.email = createUserDto.email.trim();
        //hash
        user.salt = await bcrypt.genSalt();
        user.password =  await bcrypt.hash(createUserDto.password,user.salt);   
        try {
            await this.userRepository.save(user);
            delete user.password;// Xóa password ở user để không hiển thị 
            return await this.signJwtToken(user.id, user.email)
        }catch(error) {            
            if(error.code == 'P2002') {
                throw new ForbiddenException(
                    'User with this email already exists'
                )
            }            
        }
        
    }
    async login(createUserDto: CreateUserDto){        
        const {email,password}= createUserDto;
        const user = await this.userRepository.findOneBy({ email: email});
        if(!user) {
            throw new ForbiddenException(
                'User not found'
            )
        }   
        const passwordMatched = await user.validatePassword(password)
        if(!passwordMatched) {
            throw new ForbiddenException(
                'Incorrect password'
            )
        }        
        delete user.password; //remove 1 field in the object        
        return await this.signJwtToken(user.id, user.email)        
    }


    async signJwtToken(userId: string, email: string):Promise<{accessToken: string}>{
        const payload = {
            sub: userId,
            email
         }
         //dang ky
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: '30m',
            secret: this.configService.get('JWT_SECRET')
     })
        return {
             accessToken: jwtString,
        }
    }
}
