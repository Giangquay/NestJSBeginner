
import { IsBoolean, IsBooleanString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min, isNumber } from "class-validator";
import { Order } from "../enum/common.enum";
import { Type,Transform} from "class-transformer";


export class PageOptionsDto {

    @Transform(({value})=>parseInt(value))
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
   readonly  page?:number=1

    
   @Transform(({value})=>parseInt(value))
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    @Max(100)
   readonly limit?:number=5

   @IsOptional()
   @IsEnum(Order)
   readonly order?: Order = Order.DESC;
 
   @IsOptional()
   @IsString()
   @Type(() => String)
   readonly sort?: string = 'createdAt';
}