import { Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dataset } from "./dataset.entity";
import { SourceField } from "src/source/entities/source-field.entity";

export enum DtoType {
    BASE = "base",
    CALCULATED = "calculated"
}


export enum ValueType {
    STRING = "string",
    NUMBER = "number",
    DATE = "date",
}

export enum AggregateType {
    NONE = "none",
    SUM = "sum",
    COUNT = "count"
}

@Entity()
export class DatasetField {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @JoinColumn({name: 'datasetId'})
    @ManyToOne(() => Dataset, (dataset) => dataset.fields)
    dataset: Dataset;

    @Column()
    dataset_id: string

    @Column({type: "enum", enum: ValueType})
    type: ValueType;

    @Column({type: "enum", enum: AggregateType})
    aggregateType: AggregateType;

    @JoinColumn({name: 'sourceFieldId'})
    sourceField: SourceField;

    @Column()
    sourceFieldId: number;
}
