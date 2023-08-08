import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostEnity } from "./postinfo.entity";

@Entity('Like')
export class LikeEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @ManyToOne(()=>PostEnity,(post)=>post.like)
    post:PostEnity;

    @ManyToOne(()=>UserEntity,(users)=>users.like)
    user:UserEntity

    @Column({ type: 'timestamp with time zone', nullable: true ,default:new Date()})
    createdAt:Date;
}