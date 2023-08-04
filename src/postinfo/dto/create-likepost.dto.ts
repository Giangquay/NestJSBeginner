import {IsNotEmpty, IsNumber,} from 'class-validator'


export class CreateLikeDto{

    id:string;

    
    user:string;

    post:string;
}