import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { SourceTable } from "./source-table.entity";
import { DatasetJoin } from "src/datasets/entities/dataset-join.entity";

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
    @ManyToOne(() => SourceTable, (sourceTable) => sourceTable.fields,{onDelete: "CASCADE"})
    sourceTable: SourceTable

    @Column()
    sourceTableId: number

    @OneToOne(() => DatasetJoin, (datasetJoin) => datasetJoin.leftSourceField, {onDelete: 'CASCADE'})
    leftJoin: DatasetJoin

    @OneToMany(() => DatasetJoin, (datasetJoin) => datasetJoin.rightSourceField)
    rightJoins: DatasetJoin[]
}
