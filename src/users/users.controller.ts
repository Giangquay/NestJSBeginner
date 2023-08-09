import { Controller,Put, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UnauthorizedException, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // TODO: Tạo User
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) { 
    return this.usersService.create(createUserDto);
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
    return this.usersService.ChangePassword(id,oldPassword,newPassword);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('/list')
  getAll(@Query("page") page:number)
  {
    return this.usersService.getAllUsers(page);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/info/:id')
  changeName(@Param('id') id: string,@Body() body:{username: string})
  {
    const name = body.username;
    return this.usersService.changeNameUser(id,name);
  } 
}
