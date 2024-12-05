import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dataset } from "./dataset.entity";

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

    @JoinTable()
    @ManyToOne(() => Dataset, (dataset) => dataset.fields)
    dataset: Dataset;

    @Column({type: "enum", enum: ValueType})
    type: ValueType;

    @Column()
    is_calculated: boolean;

    @Column()
    formula?: string;

    @Column({type: "enum", enum: AggregateType})
    aggregate_type?: AggregateType;

    @Column()
    base_field?: string;
}
