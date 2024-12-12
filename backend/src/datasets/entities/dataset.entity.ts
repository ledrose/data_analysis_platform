import { Connection } from "../../connections/entities/connection.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DatasetField } from "./dataset-field.entity";
import { DatasetJoin } from "./dataset-join.entity";
import { SourceTable } from "src/source/entities/source-table.entity";

@Entity()
export class Dataset {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @JoinColumn({name: 'connectionId'})
    @ManyToOne(() => Connection, (connection) => connection.datasets)
    connection: Connection;

    @Column()
    connectionId: string

    @OneToMany(() => DatasetField, (field) => field.dataset)
    fields: DatasetField[];

    @OneToMany(() => DatasetJoin, (join) => join.dataset)
    joins: DatasetJoin[]

    @OneToMany(() => SourceTable, (table) => table.sourceDataset)
    sourceTables: SourceTable[];
}
