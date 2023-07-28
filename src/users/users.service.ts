import { Injectable, BadRequestException, HttpException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) { }

  async create(createUserDto: CreateUserDto):Promise<Users>{
    const user: Users = new Users(); 
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    if(await this.userRepository.findOneBy({email: `${user.email}`}))
    {
      throw new BadRequestException('Email da ton tai.');
    }else{

      return this.userRepository.save(user);
    }
  }

  async validateUser(email: string, password: string):Promise<Users>{
    const user = await this.userRepository.findOneBy({ email : `${email}`,password: `${password}`});
    if(user)
    {
        return user
    }
    return null;
  }

  async validatePassword(userId: number,oldPassword: string,newPassword:string):Promise<Users>{
    const user: Users = new Users();
    const userKT = await this.userRepository.findOneBy({id: userId});
    if(userKT&&userKT.password===oldPassword)
    {
      user.password = newPassword;
      this.userRepository.save(user);
      this.logger.log("1");
      return user;
    }else{
      throw new BadRequestException('mật khẩu không khớp');
    }
    
  }

  findOne(id: number): Promise<Users> {
    return this.userRepository.findOneBy({ id });
  }
  remove(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}
