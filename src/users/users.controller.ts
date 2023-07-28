import { Controller,Put, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { async } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() body:{email:string,password:string})
  {
      const {email,password}=body;
      const user = await this.usersService.validateUser(email,password);
      if(!user)
      {
        throw new UnauthorizedException("Email va Password khong dung");
      }
      return user;
  }
  @Put(':id/password')
   changePassword(@Param('id') id: string,@Body() body: { oldPassword: string; newPassword: string })
  {
    const { oldPassword, newPassword } = body;
    return this.usersService.validatePassword(+id,oldPassword,newPassword);
  }
}
