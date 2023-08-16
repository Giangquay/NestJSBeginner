import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PageOptionsDto } from 'src/postinfo/dto/page.dto';
import { pick } from 'src/handler/handler';
import RoleGuard from 'src/guard/role.guard';
import { Permission, Role } from 'src/enum/common.enum';
import PremissionGuard from 'src/guard/permission.guard';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { saveImageToStorage } from 'src/configs/image.store';
import { of } from 'rxjs';
import { SizeLimitInterceptor } from 'src/guard/limitguard.guard';
import { AuthGuard } from '@nestjs/passport';
import { FileSizeValidatonPipe } from 'src/helpers/uploadFile.config';



@UsePipes(new ValidationPipe({ transform: true}))
@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService){
        
    }    
    @Post("register",) //register a new user          
    register(@Body() createUserDto: CreateUserDto) {        
        //not validate using class-validator AND class-transformer        
        return this.authService.register(createUserDto);
    }
    //POST: .../auth/login
    @Post("login") 
    login(@Body() createUserDto: CreateUserDto) {
        return this.authService.login(createUserDto);
    }

    @UseGuards(RoleGuard(Role.Admin))
    @Get('user/list')
    @UsePipes(ValidationPipe)
    findAll(@Query() pagedto:PageOptionsDto ){
    const options = pick(pagedto,['page','limit','sort','order']);
    const listUser = this.authService.getAllUsers(options);
    return listUser;
  }

  
    @Delete('user')
    @UseGuards(PremissionGuard(Permission.Delete))
    async deletePost(@Req() request:Request) {
        // console.log(request.user['email'])
    return this.authService.deleteUser(request.user['id']);
    }


    //Cap quyen cho nguoi dung


    //Thay doi anh nguoi dung
    @Put('user/upload')
    @UseGuards(AuthGuard('jwt'))
    // @UsePipes(FileSizeValidatonPipe)
   // @UseInterceptors(new SizeLimitInterceptor(1024 * 1024))
    @UseInterceptors(FileInterceptor('file',saveImageToStorage))
    uploadFile(@Req() request:Request,@UploadedFile() file: Express.Multer.File) {
      const filename = file?.filename;//return undefined || null if object undefined instance is error
      if(!filename) return of({
        error:'File must be a png, jpg/jpeg'
      })
      return this.authService.uploadAvatarUserById(request.user['id'],filename);
    }
}
