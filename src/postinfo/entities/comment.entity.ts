import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Postinfo } from "./postinfo.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { BaseEntity } from "src/entity/baseEntity.entity";


@Entity('comments')
export class Comments extends BaseEntity{

    @Column()
    content: string;

    @ManyToOne(()=>Postinfo,(post)=>post.id)
    post:Postinfo;

    @ManyToOne(()=>UserEntity,(users)=>users.id)
    user:UserEntity
}