import { Connection } from "src/connections/entities/connection.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SourceField } from "./source-field.entity";
import { Dataset } from "src/datasets/entities/dataset.entity";

@Entity()
export class SourceTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Dataset, (dataset) => dataset.sourceTables)
    @JoinColumn({name: 'sourceConnectionId'})
    sourceDataset: Dataset;  

    @Column()
    sourceDatasetId: string;

    @OneToMany(() => SourceField, (field) => field.sourceTable)
    fields: SourceField[]

}
