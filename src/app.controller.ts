import { Controller,Patch,Optional,Head,All,Req, Get, Post} from '@nestjs/common';

import { AppService } from './app.service';


@Controller('home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/login')
  login()
  {
    return this.appService.loginUser();
  }
  @Post('/register')
  register()
  {
    return this.appService.registerUser();
  }
  @Post("/changePassword")
  chang()
  {
      return this.appService.changePassword();
  }
}
