import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

 
  loginUser(): string {
      return "login successfully";
  }

  registerUser(): string {
    return "register successfully";
  }

  changePassword(): string {
    return "change password successfully";
  }
}
