import { UserEntity } from "src/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Comments } from "./comment.entity";
import { BaseEntity } from "src/entity/baseEntity.entity";
@Entity('post')
export class Postinfo extends BaseEntity {
    @Column({name :'title',type:'text'})
    title: string;

    @Column({name :'contentpost',type:'text'})
    contentpost:string

    @Column({name :'image',type:'text'})
    image: string;

    @ManyToOne(()=>UserEntity,(user)=>user.post)
    @JoinColumn({name: 'uid'})
    user:UserEntity;

    @OneToMany(()=>Comments,(comment:Comments)=>comment.post)
    comments:Comments[];
    
}
