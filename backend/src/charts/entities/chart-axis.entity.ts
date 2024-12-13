import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chart } from "./chart.entity";
import { DatasetField } from "src/datasets/entities/dataset-field.entity";

export enum AxisType {
    X = "x",
    Y = "y"
}

@Entity()
export class ChartAxis {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "enum", enum: AxisType})
    type: AxisType;

    @JoinColumn({name: 'chartId'})
    @ManyToOne(() => Chart, (chart) => chart.axes)
    chart: Chart;

    @Column()
    chartId: string;

    @JoinColumn({name: 'fieldId'})
    @ManyToOne(() => DatasetField, (field) => field.id)
    field: DatasetField

    @Column()
    fieldId: number
}
