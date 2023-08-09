import { Injectable, BadRequestException, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();
    user.email = createUserDto.email.trim();
    //hash
    user.salt = await bcrypt.genSalt();
    user.password =  await bcrypt.hash(createUserDto.password,user.salt);
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

  async loginUser(createUserDto: CreateUserDto): Promise<UserEntity>{
    const {email,password}= createUserDto;
    const user = await this.userRepository.findOneBy({ email: email});
    if(user)
    {
      if(await user.validatePassword(password))
      {
        delete user.password;delete user.salt;delete user.updated;
        return user;
      }else{
        throw new HttpException("Mật khẩu không đúng",HttpStatus.BAD_REQUEST);
      }
      
    }else{
      throw new HttpException("Email không có trong hệ thống",HttpStatus.BAD_REQUEST);
    }
    
  }

  async ChangePassword(userId: string, oldPassword: string, newPassword: string): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();
    let dateNow = new Date();
    if(isValidUUID(userId))
    {
      const userKT = await this.userRepository.findOneBy({ id: userId });
      if (userKT&& await userKT.validatePassword(oldPassword)) {
        user.id = userId;
        user.updated = dateNow;
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(newPassword,user.salt);
        await this.userRepository.save(user);
        delete user.password;
        delete user.salt;
        return  user;
      } else {
        throw new BadRequestException('mật khẩu không khớp');
      }
    }else{
      throw new BadRequestException('Không tìm thấy người dùng');
    }
    
  }

  async getAllUsers(page:number):Promise<UserEntity[]>{

    const item:number=5;
    const lengUser = await this.userRepository.createQueryBuilder().getCount();
    let totalPager:number;
    if(lengUser%item==0)
    {
      totalPager = (lengUser/item);
        
    }else {
      totalPager = Math.ceil(lengUser/item);
    }
    if(page>totalPager)
    {
      throw new HttpException("Not found",HttpStatus.NOT_FOUND);
    }else{
      return await this.userRepository.createQueryBuilder("users").orderBy("users.id").select(["users.username","users.email","users.id"])
      .skip(item*(page-1)).take(item)
      .getMany();
    }
   
  }

  async changeNameUser(userid:string,usernameNew:string):Promise<UserEntity>{
    const user:UserEntity = new UserEntity();
    user.username = usernameNew.trim();
    user.id = userid;
    if(isValidUUID(user.id))
    {
      const checkUpdate = await this.userRepository.createQueryBuilder().update(UserEntity,user).set({
        username: user.username,
      }).where("id= :id",{id : user.id}).execute();
      if(checkUpdate.affected>0)
      {
        const getIdUser =  await this.userRepository.findOneBy({id : user.id});
        user.id = getIdUser.id;
        user.username = getIdUser.username;
        user.createdAt = getIdUser.createdAt;
        user.updated = getIdUser.updated;
        delete user.password;
        return user;
      }else {
          throw new HttpException("User not found",HttpStatus.BAD_REQUEST);
      }
    }else{
      throw new HttpException("User not found",HttpStatus.BAD_REQUEST);
    }
  }
}
