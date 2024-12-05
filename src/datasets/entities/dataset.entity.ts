import { Connection } from "../../connections/entities/connection.entity";
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DatasetField } from "./dataset-field.entity";

@Entity()
export class Dataset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @JoinTable()
    @OneToMany(() => Connection, (connection) => connection.datasets)
    connection: Connection;

    @Column()
    primary_table: string;

    @OneToMany(() => DatasetField, (field) => field.dataset)
    fields?: DatasetField[];
}
