import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { SourceTable } from "./source-table.entity";

@Entity()
@Unique('upsert_name_id', ['name', 'sourceTableId'])
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
