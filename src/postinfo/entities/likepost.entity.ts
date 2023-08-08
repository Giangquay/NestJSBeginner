import { UserEntity } from "src/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Postinfo } from "./postinfo.entity";
import {BaseEntity} from "../../entity/baseEntity.entity"

@Entity('Like')
export class LikeEntity extends BaseEntity{

    @ManyToOne(()=>UserEntity,(user)=>user.id)
    user:UserEntity;

    @ManyToOne(()=>Postinfo,(post)=>post.id)
    post:Postinfo;

}