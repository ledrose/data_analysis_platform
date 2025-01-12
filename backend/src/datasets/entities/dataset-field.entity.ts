import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Dataset } from "./dataset.entity";
import { SourceField } from "src/source/entities/source-field.entity";
import { DatasetJoin } from "./dataset-join.entity";

export enum DtoType {
    BASE = "base",
    CALCULATED = "calculated"
}


export enum ValueType {
    STRING = "string",
    INTEGER = "integer",
    FLOAT = "float",
    DATE = "date",
    DATETIME = "datetime",
    BOOLEAN = "boolean"
}

export enum AggregateType {
    NONE = "none",
    SUM = "sum",
    COUNTUNIQUE = "countunique",
    COUNT = "count"
}

@Entity()
@Unique('upsert_dataset_field', ["name", "datasetId"])
export class DatasetField {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => DatasetJoin, (join) => join.leftSourceField, {onDelete: 'CASCADE'})    
    leftJoin: DatasetJoin[]

    @OneToMany(() => DatasetJoin, (join) => join.leftSourceField, {onDelete: 'CASCADE'})    
    rightJoin: DatasetJoin[]

    @Column({unique: true})
    name: string;

    @JoinColumn({name: 'datasetId'})
    @ManyToOne(() => Dataset, (dataset) => dataset.fields)
    dataset: Dataset;

    @Column()
    datasetId: string

    @Column({type: "enum", enum: ValueType})
    type: ValueType;

    @Column({default: true})
    isSimple: boolean

    @Column({type: "enum", enum: AggregateType, nullable: true})
    aggregateType: AggregateType;

    @Column({nullable: true})
    formula: string

    @JoinTable({
        name: "dataset_field_source_field",
        joinColumn: {
            name: "datasetFieldId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "sourceFieldId",
            referencedColumnName: "id"
        }
    })
    // @JoinColumn({name: 'sourceFieldId'})
    @ManyToMany(() => SourceField,(sourceField) => sourceField.datasetFields, {cascade: true})
    sourceFields: SourceField[];
}
