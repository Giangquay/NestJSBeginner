import { Users } from "src/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
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

    @ManyToOne(()=>Users,(user)=>user.post)
    @JoinColumn({name: 'uid'})
    user:Users;

}
