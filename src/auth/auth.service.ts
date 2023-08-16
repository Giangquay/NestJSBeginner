import { Injectable,ForbiddenException ,Req, HttpException, HttpStatus} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PageOptionsDto } from 'src/postinfo/dto/page.dto';
import { validate as isValidUUID } from 'uuid';
import { deleteProperties } from 'src/handler/handler';
@Injectable()
export class AuthService {
  
    constructor(private jwtService: JwtService,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private configService:ConfigService){}
    //api get all users
    async getAllUsers(pagedto:PageOptionsDto ):Promise<any>{
        try{
          const skip = (pagedto.page-1)*pagedto.limit;
           const data=await this.userRepository.createQueryBuilder('user').select(['user.username','user.email','user.createdAt'])
         .orderBy(`user.${pagedto.sort}`,pagedto.order)
         .take(pagedto.limit).skip(skip)
         .getMany();
         return {
           data:data,
           page: pagedto.page,
           limt: pagedto.limit,
         };
       }catch(e)
       {
           throw new HttpException(e.message,HttpStatus.BAD_REQUEST);
       }
    }

    //api delete User
    async deleteUser(user_id:string):Promise<DeleteResult>
    {
      if(isValidUUID(user_id))
      {
        const userExists = await this.userRepository.findOneBy({ id: user_id });
      if(userExists)
      {
        return this.userRepository
        .createQueryBuilder()
        .delete()
        .from('users')
        .where('id = :id', {id:user_id})
        .execute();;
      }else{
         throw new HttpException("Không tìm thấy comment",HttpStatus.BAD_REQUEST);
      }
    }
    }

    //api register
    async register(createUserDto: CreateUserDto){ 
        const user: UserEntity = new UserEntity();
        user.email = createUserDto.email.trim();
        const EmailExits = await this.userRepository.findOneBy({email:user.email})
        if(EmailExits)
        {
            throw new HttpException("Email is exists. Please use email different",HttpStatus.BAD_REQUEST);
        }
        //hash
        user.salt = await bcrypt.genSalt();
        user.password =  await bcrypt.hash(createUserDto.password,user.salt);   
        try {
            await this.userRepository.save(user);
            delete user.password;// Xóa password ở user để không hiển thị 
            return await this.signJwtToken(user)
        }catch(error) {            
            if(error.code == 'P2002') {
                throw new ForbiddenException(
                    'User with this email already exists'
                )
            }            
        }
        
    }

    //api login
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
        return await this.signJwtToken(user)        
    }

    //signJwtToken
    async signJwtToken(user:UserEntity):Promise<{accessToken: string}>{
        const payload = {
            sub: user.id,
            user:user.username,
         }
         //dang ky
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: '5h',
            secret: this.configService.get('JWT_SECRET')
     })
        return {
             accessToken: jwtString,
        }
    }

    //api updateload file image
    async uploadAvatarUserById(id:string,avatar:string):Promise<UserEntity>{
        const user:UserEntity = new UserEntity();
        user.id=id;
        user.avatar=avatar;
        await this.userRepository.save(user)
        deleteProperties(user,['salt','createdAt','updated','username'])
        return user;
      }
}


