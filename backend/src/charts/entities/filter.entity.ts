import { DatasetField } from "src/datasets/entities/dataset-field.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chart } from "./chart.entity";

@Entity()
export class ChartFilter {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    chartId: string

    @ManyToOne(() => Chart, (chart) => chart.filters)
    @JoinColumn({name: 'chartId'})
    chart: Chart

    @Column()
    fieldId: number

    @ManyToOne(() => DatasetField)
    @JoinColumn({name: 'fieldId'})
    field: DatasetField

    @Column({default: "="})
    operator: string = "="

    @Column({default: "0"})
    value1: string

    @Column({nullable: true})
    value2?: string
}
