import { Connection } from "src/connections/entities/connection.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SourceField } from "./source-field.entity";

@Entity()
export class SourceTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Connection, (connection) => connection.tables)
    @JoinColumn({name: 'sourceConnectionId'})
    sourceConnection: Connection;  

    @Column()
    sourceConnectionId: number;

    @OneToMany(() => SourceField, (field) => field.sourceTable)
    fields: SourceField[]

}
