
import {IsArray, IsNotEmpty, IsOptional, IsUUID} from 'class-validator'
import { Postinfo } from "../entities/postinfo.entity";


export class CreateCommentDto {

    id:string;

    @IsNotEmpty()
    content: string;

    post:string;
    
    user:string;
}