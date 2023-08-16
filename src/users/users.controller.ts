import { Controller,Put, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UnauthorizedException, UseGuards, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidatonPipe } from 'src/helpers/uploadFile.config';
import { saveImageToStorage } from 'src/configs/image.store';
import { of, switchMap } from 'rxjs';
import { Request } from 'express';
import { UserEntity } from './entities/user.entity';
import { PageOptionsDto } from 'src/postinfo/dto/page.dto';
import { pick } from 'src/handler/handler';
// import RoleGuard from 'src/guard/role.guard';
import { Role } from 'src/enum/common.enum';
@UsePipes(new ValidationPipe({ transform: true}))
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

  // @UseGuards(RoleGuard(Role.Admin))
  @Put('/password')
  @UseGuards(AuthGuard('jwt'))
   changePassword(@Req() request:Request,@Body() body)
  {
    const {oldPassword,newPassword}=body;
    return this.usersService.ChangePassword(request.user['id'],oldPassword,newPassword);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('/list')
  @UsePipes(ValidationPipe)
  findAll(@Query() pagedto:PageOptionsDto ){
    const options = pick(pagedto,['page','limit','sort','order']);
    const listUser = this.usersService.getAllUsers(options);
    return listUser;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/info')
  changeName(@Req() request:Request,@Body() body:{username: string})
  {
    const name = body.username;
    return this.usersService.changeNameUser(request.user['id'],name);
  } 


  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file',saveImageToStorage))
  // @UsePipes(FileSizeValidatonPipe)
  uploadFile(@Req() request:Request,@UploadedFile() file: Express.Multer.File) {
    const filename = file?.filename;//return undefined || null if object undefined instance is error
    if(!filename) return of({
      error:'File must be a png, jpg/jpeg'
    })
    return this.usersService.uploadAvatarUserById(request.user['id'],filename);
  }
}
