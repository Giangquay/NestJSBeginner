import { UserEntity } from "src/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Comments } from "./comment.entity";
@Entity('post')
export class Postinfo {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({name :'title',type:'text'})
    title: string;

    @Column({name :'contentpost',type:'text'})
    contentpost:string

    @Column({name :'image',type:'text'})
    image: string;

    @Column({name: 'createat', type: 'date',default :new Date()})
    createat:Date;

    @Column({name: 'updateat',type :'date',default :new Date()})
    updateat:Date;

    @ManyToOne(()=>UserEntity,(user)=>user.post)
    @JoinColumn({name: 'uid'})
    user:UserEntity;

    @OneToMany(()=>Comments,(comment:Comments)=>comment.post)
    comments:Comments[];
    
}
