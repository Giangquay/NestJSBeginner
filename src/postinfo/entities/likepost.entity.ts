import { UserEntity } from "src/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Postinfo } from "./postinfo.entity";


@Entity('Like')
export class LikeEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ManyToOne(()=>UserEntity,(user)=>user.id)
    user:UserEntity;

    @ManyToOne(()=>Postinfo,(post)=>post.id)
    post:Postinfo;

}