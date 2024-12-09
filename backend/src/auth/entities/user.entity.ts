import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {Connection} from "../../connections/entities/connection.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    passwordHash: string;

    @OneToMany(() => Connection, (connection) => connection.user)
    connections: Connection[]
}
