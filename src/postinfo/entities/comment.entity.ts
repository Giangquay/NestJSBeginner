import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Postinfo } from "./postinfo.entity";
import { Users } from "src/users/entities/user.entity";


@Entity('comments')
export class Comments{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    content: string;

    @ManyToOne(()=>Postinfo,(post)=>post.id)
    post:Postinfo

    @ManyToOne(()=>Users,(users)=>users.id)
    user:Users
}