import { Users } from "src/users/entities/user.entity";
import {IsArray, IsOptional, IsUUID} from 'class-validator'
import { Postinfo } from "../entities/postinfo.entity";


export class CreateCommentDto {

    id:string;

    content: string;

    post:string;
    
    user:number
}