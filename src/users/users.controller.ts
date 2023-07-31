import { Controller,Put, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // TODO: Tạo User
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }


  //TODO: Tìm kiếm User
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  //TODO: Xóa User
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

  //TODO: Đăng nhập 
  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() createUserDto: CreateUserDto) 
  {
      return this.usersService.loginUser(createUserDto);
  }

  //Thay đổi mật khẩu
  @Put('/password/:id')
   changePassword(@Param('id') id: string,@Body() body: { oldPassword: string; newPassword: string })
  {
    const { oldPassword, newPassword } = body;
    return this.usersService.validatePassword(+id,oldPassword,newPassword);
  }
}
