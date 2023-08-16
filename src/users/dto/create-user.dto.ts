import{
    IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MinLength,
  isEmail,
  isUUID,
}from 'class-validator'


export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;
    @IsNotEmpty()
    password: string;
}


