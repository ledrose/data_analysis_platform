import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SourceTable } from "./source-table.entity";

@Entity()
export class SourceField {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    dataType: string

    @JoinColumn({name: 'sourceTableId'})
    @ManyToOne(() => SourceTable, (sourceTable) => sourceTable.fields)
    sourceTable: SourceTable

    @Column()
    sourceTableId: number
}
