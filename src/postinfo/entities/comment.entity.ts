import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Postinfo } from "./postinfo.entity";
import { UserEntity } from "src/users/entities/user.entity";


@Entity('comments')
export class Comments{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    content: string;

    @ManyToOne(()=>Postinfo,(post)=>post.id)
    post:Postinfo;
    // @ManyToOne(()=>Postinfo,(post)=>post.comment,{
    //     eager: true,
    //     onDelete: 'CASCADE'
    // })
    // post:Postinfo[];
    @ManyToOne(()=>UserEntity,(users)=>users.id)
    
    user:UserEntity
}