import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dataset } from "./dataset.entity";
import { SourceField } from "src/source/entities/source-field.entity";

export enum JoinType {
    INNER = "inner",
    LEFT = "left",
    RIGHT = "right",
}

@Entity()
export class DatasetJoin {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({name: 'leftSourceFieldId'})
    @OneToOne(() => SourceField, (field) => field.id,{onDelete: 'CASCADE'})
    leftSourceField: SourceField;

    @Column()
    leftSourceFieldId: number;

    @JoinColumn({name: 'rightSourceFieldId'})
    @ManyToOne(() => SourceField, (field) => field.id, {cascade: true})
    rightSourceField: SourceField;

    @Column()
    rightSourceFieldId: number;

    @Column({type: "enum", enum: JoinType})
    type: JoinType;

    @JoinColumn({name: 'datasetId'})
    @ManyToOne(() => Dataset, (dataset) => dataset.joins)
    dataset: Dataset;

    @Column()
    datasetId: string;
}

