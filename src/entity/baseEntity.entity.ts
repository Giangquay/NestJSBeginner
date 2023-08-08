import { Column, PrimaryGeneratedColumn } from "typeorm";


export abstract class BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({name: 'created', type: 'date',default :new Date()})
    createdAt:Date;

    @Column({name: 'updated',type :'date',default :new Date()})
    updated:Date;


    isDelete:boolean;
}