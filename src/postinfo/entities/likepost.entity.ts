import { Users } from "src/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Postinfo } from "./postinfo.entity";


@Entity('Like')
export class Like {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ManyToOne(()=>Users,(user)=>user.id)
    user:Users;

    @ManyToOne(()=>Postinfo,(post)=>post.id)
    post:Postinfo;

}