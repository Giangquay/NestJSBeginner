import { PostEnity } from "src/postinfo/entities/postinfo.entity";
import { Entity,Column,PrimaryGeneratedColumn ,PrimaryColumn, ManyToOne, OneToMany, CreateDateColumn, JoinColumn} from "typeorm";
import * as bcrypt from 'bcrypt';
import { CommentsEntity } from "src/postinfo/entities/comment.entity";
import { LikeEntity } from "src/postinfo/entities/likepost.entity";
import { BaseEntity } from "src/entity/baseEntity.entity";
@Entity('users')
export class UserEntity  extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:false, type: 'varchar', length: 255 })
    email!:string;

    @Column({name:'username',type :'varchar',length:255,nullable:true})
    username:string

    @Column({type : 'varchar', length:255 ,nullable:false})
    password:string;

    @OneToMany(()=>PostEnity,(post)=>post.user,{eager:true})
    post:PostEnity[]

    @Column({type:'varchar',nullable:true})
    salt:string;

    @OneToMany(()=>CommentsEntity,(comment)=>comment.user,{eager:true})
    comments:CommentsEntity[]

    @OneToMany(()=>LikeEntity,(like:LikeEntity)=>like.user)
    like:LikeEntity[];
    
    async validatePassword(password:string): Promise<boolean>{
        const hash = await bcrypt.hash(password,this.salt);
        return hash==this.password;
    }


}