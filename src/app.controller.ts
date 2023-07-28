import { Controller,Patch,Optional,Head,All,Req, Get, Post} from '@nestjs/common';

import { AppService } from './app.service';


@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

}
