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

  create(createUserDto: CreateUserDto): Promise<Users> {
    const user: Users = new Users();
    let dateNow = new Date();
    user.email = createUserDto.email.trim();
    user.password = createUserDto.password.trim();
    user.createdate = dateNow;
    if (this.userRepository.findOneBy({ email: `${user.email}` })) {
      throw new BadRequestException('Email đã tồn tại vui lòng đổi email khác');
    } else {
      return this.userRepository.save(user);
    }
  }

  async loginUser(createUserDto: CreateUserDto): Promise<Users> {
    const user: Users = new Users();
    user.email = createUserDto.email.trim();
    user.password = createUserDto.password.trim();
    const foundUser = await this.userRepository.findOneBy({ email: user.email, password: user.password });
      if (foundUser == null) {
        throw new HttpException("Tên tài khoản của bạn hoặc Mật khẩu không đúng, vui lòng thử lại", HttpStatus.BAD_REQUEST);
      } else {
        return foundUser;
      }
  }

  async validatePassword(userId: number, oldPassword: string, newPassword: string): Promise<any> {
    const user: Users = new Users();
    let dateNow = new Date();
    const userKT = await this.userRepository.findOneBy({ id: userId });
    if (userKT && userKT.password === oldPassword.trim()) {
      user.id = userId;
      user.updatedate = dateNow;
      user.password = newPassword.trim();
      this.userRepository.save(user);
      return JSON.stringify({ message: 'Sửa thành công' })
    } else {
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
