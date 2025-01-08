import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChartAxis } from "./chart-axis.entity";
import { Dataset } from "src/datasets/entities/dataset.entity";


export enum ChartType {
    BAR = "bar",
    LINE = "line",
    PIE = "pie"
}

@Entity()
export class Chart {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    description: string

    @ManyToOne(() => Dataset, (dataset) => dataset.charts)
    @JoinColumn({name: 'datasetId'})
    dataset: Dataset

    @Column()
    datasetId: string;

    @OneToMany(() => ChartAxis, (axis) => axis.chart)
    axes: ChartAxis[];


}
