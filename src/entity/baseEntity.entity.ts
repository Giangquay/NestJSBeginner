import { Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";


export abstract class BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({ type: 'timestamp with time zone', nullable: true ,default: () => 'CURRENT_TIMESTAMP' })
    createdAt:Date;

    @Column({ type: 'timestamp with time zone', nullable: true ,default: () => 'CURRENT_TIMESTAMP' })
    updated:Date;

    isDelete:boolean;
}