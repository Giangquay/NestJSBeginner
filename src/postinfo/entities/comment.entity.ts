import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostEnity } from "./postinfo.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { BaseEntity } from "src/entity/baseEntity.entity";


@Entity('comments')
export class CommentsEntity extends BaseEntity{

    @Column()
    content: string;

    @ManyToOne(()=>PostEnity,(post)=>post.id)
    post:PostEnity;

    @ManyToOne(()=>UserEntity,(users)=>users.id)
    user:UserEntity
}