import { Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";


export abstract class BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({ type: 'timestamp with time zone', nullable: true ,default:new Date()})
    createdAt:Date;

    @Column({ type: 'timestamp with time zone', nullable: true ,default:new Date()})
    updated:Date;


    isDelete:boolean;
}