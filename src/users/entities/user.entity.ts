import { Entity,Column,PrimaryGeneratedColumn ,PrimaryColumn} from "typeorm";
@Entity('users')
export class Users {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false, type: 'varchar', length: 255 })
    email!:string;

    @Column({type : 'varchar', length:255 })
    password:string;

    @Column({type: 'date'})
    createdate:Date;


    @Column({type:'date'})
    updatedate:Date;
}