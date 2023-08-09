import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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
}
