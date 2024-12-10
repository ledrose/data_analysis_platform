import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dataset } from "./dataset.entity";
import { SourceField } from "src/source/entities/source-field.entity";

@Entity()
export class DatasetJoin {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({name: 'leftSourceFieldId'})
    @OneToMany(() => SourceField, (field) => field.id)
    leftSourceField: SourceField;

    @Column()
    leftSourceFieldId: number;

    @JoinColumn({name: 'rightSourceFieldId'})
    @OneToMany(() => SourceField, (field) => field.id)
    rightSourceField: SourceField;

    @Column()
    rightSourceFieldId: number;

    @JoinColumn({name: 'datasetId'})
    @OneToMany(() => Dataset, (dataset) => dataset.joins)
    dataset: Dataset;

    @Column()
    datasetId: number;
}
