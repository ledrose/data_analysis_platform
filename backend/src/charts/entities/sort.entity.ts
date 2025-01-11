import { DatasetField } from "src/datasets/entities/dataset-field.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chart } from "./chart.entity";

@Entity()
export class ChartSort {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chartId: string

    @ManyToOne(() => Chart, (chart) => chart.sorts)
    @JoinColumn({name: 'chartId'})
    chart: Chart

    @Column()
    fieldId: number

    @ManyToOne(() => DatasetField)
    @JoinColumn({name: 'fieldId'})
    field: DatasetField

    @Column({default: 0})
    order: number

    @Column({default: true})
    asc: boolean
}
