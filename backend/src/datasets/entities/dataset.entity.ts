import { Connection } from "../../connections/entities/connection.entity";
import { Column, Entity, Join, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DatasetField } from "./dataset-field.entity";
import { DatasetJoin } from "./dataset-join.entity";

@Entity()
export class Dataset {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @JoinTable()
    @OneToMany(() => Connection, (connection) => connection.datasets)
    connection: Connection;

    @Column()
    primary_table: string;
    
    @OneToMany(() => DatasetField, (field) => field.dataset)
    fields: DatasetField[];

    @ManyToOne(() => DatasetJoin, (join) => join.dataset)
    joins: DatasetJoin[]
}
