import { Connection } from "../../connections/entities/connection.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DatasetField } from "./dataset-field.entity";
import { DatasetJoin } from "./dataset-join.entity";

@Entity()
export class Dataset {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @JoinColumn({name: 'connectionId'})
    @OneToMany(() => Connection, (connection) => connection.datasets)
    connection: Connection;

    @Column()
    connectionId: string

    @OneToMany(() => DatasetField, (field) => field.dataset)
    fields: DatasetField[];

    @ManyToOne(() => DatasetJoin, (join) => join.dataset)
    joins: DatasetJoin[]
}
