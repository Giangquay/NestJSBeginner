import {IsNotEmpty, IsNumber,} from 'class-validator'


export class CreateLikeDto{

    id:string;

    
    user:number;

    post:string;
}