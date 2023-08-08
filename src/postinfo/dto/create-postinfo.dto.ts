
import {IsArray, IsOptional, IsUUID} from 'class-validator'
export class CreatePostinfoDto {


    pid : string;

    
    title: string;

    contentpost:string

    image: string;
   
    createat:Date;

    updateat:Date;

    uid:string;
}
