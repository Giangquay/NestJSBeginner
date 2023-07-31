import { Injectable, BadRequestException, HttpException, Logger, HttpStatus } from '@nestjs/common';
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

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const user: Users = new Users();
    let dateNow = new Date();
    user.email = createUserDto.email.trim();
    user.password = createUserDto.password.trim();
    user.createdate = dateNow;
    const foundUser = await this.userRepository.findOneBy({ email: user.email })
    console.log(foundUser);
    if (foundUser==null) {
      await this.userRepository.save(user);
      delete user.password;// Xóa password ở user để không hiển thị 
      return user;
    } else {
      throw new BadRequestException('Email đã tồn tại vui lòng đổi email khác');
    }
  }

  async validateEmailUser(email:string){
    const foundUser = await this.userRepository.findOneBy({ email: email })
    if(foundUser)
    {
      return true;
    }
    return false;
  }

  async loginUser(createUserDto: CreateUserDto): Promise<Users>{
    const user: Users = new Users();
    user.email = createUserDto.email.trim();
    user.password = createUserDto.password.trim();
    const foundEmailUser = await this.validateEmailUser(user.email);
    if(foundEmailUser==true)
    {
      const foundUser = await this.userRepository.findOneBy({ email: user.email, password: user.password });
      if (foundUser == null) {
        throw new HttpException("Email hoặc Mật khẩu của bạn không đúng, vui lòng thử lại", HttpStatus.BAD_REQUEST);
      } else {
        delete foundUser.password;
        return foundUser;
      }
    }else{
      throw new HttpException("Email không có trong hệ thống",HttpStatus.BAD_REQUEST);
    }
    
  }

  async ChangePassword(userId: number, oldPassword: string, newPassword: string): Promise<Users> {
    const user: Users = new Users();
    let dateNow = new Date();
    const userKT = await this.userRepository.findOneBy({ id: userId });
    if (userKT && userKT.password === oldPassword.trim()) {
      user.id = userId;
      user.updatedate = dateNow;
      user.password = newPassword.trim();
      await this.userRepository.save(user);
      delete user.password;
      return  user;
    } else {
      throw new BadRequestException('mật khẩu không khớp');
    }
  }

}
