import { UserEntity } from "src/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { CommentsEntity } from "./comment.entity";
import { BaseEntity } from "src/entity/baseEntity.entity";
import { LikeEntity } from "./likepost.entity";
@Entity('post')
export class PostEnity extends BaseEntity {
    @Column({name :'title',type:'text'})
    title: string;

    @Column({name :'contentpost',type:'text'})
    contentpost:string

    @Column({name :'image',type:'text'})
    image: string;

    @ManyToOne(()=>UserEntity,(user)=>user.post)
    @JoinColumn({name: 'uid'})
    user:UserEntity;

    @OneToMany(()=>CommentsEntity,(comment:CommentsEntity)=>comment.post,{onDelete: "CASCADE",
    onUpdate: "CASCADE",})
    comments:CommentsEntity[];
    
    @OneToMany(()=>LikeEntity,(like:LikeEntity)=>like.post,{onDelete: "CASCADE",
    onUpdate: "CASCADE",})
    like:LikeEntity[];
}
