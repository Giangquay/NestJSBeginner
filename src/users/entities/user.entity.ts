import { Postinfo } from "src/postinfo/entities/postinfo.entity";
import { Entity,Column,PrimaryGeneratedColumn ,PrimaryColumn, ManyToOne, OneToMany, CreateDateColumn} from "typeorm";
@Entity('users')
export class Users {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:false, type: 'varchar', length: 255 })
    email!:string;

    @Column({name:'username',type :'varchar',length:255,nullable:true})
    username:string

    @Column({type : 'varchar', length:255 ,nullable:false})
    password:string;

    @Column({name: 'created',type :'date',default :new Date()})
    createdate:Date;


    @Column({name: 'updateat',type :'date',default :new Date()})
    updatedate:Date;

    @OneToMany(()=>Postinfo,(post)=>post.user)
    post:Postinfo[]
}