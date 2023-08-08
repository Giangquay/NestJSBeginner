import { Postinfo } from "src/postinfo/entities/postinfo.entity";
import { Entity,Column,PrimaryGeneratedColumn ,PrimaryColumn, ManyToOne, OneToMany, CreateDateColumn, JoinColumn} from "typeorm";
import * as bcrypt from 'bcrypt';
import { Comments } from "src/postinfo/entities/comment.entity";
import { LikeEntity } from "src/postinfo/entities/likepost.entity";
@Entity('users')
export class UserEntity {

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

    @OneToMany(()=>Postinfo,(post)=>post.user,{eager:true})
    post:Postinfo[]

    @Column({type:'varchar',nullable:true})
    salt:string;

    @OneToMany(()=>Comments,(comment)=>comment.user,{eager:true})
    comments:Comments[]

    @OneToMany(()=>LikeEntity,(like)=>like.user)
    like:LikeEntity[]
    async validatePassword(password:string): Promise<boolean>{
        const hash = await bcrypt.hash(password,this.salt);
        return hash==this.password;
    }


}