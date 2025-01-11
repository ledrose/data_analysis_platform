import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChartAxis } from "./chart-axis.entity";
import { Dataset } from "src/datasets/entities/dataset.entity";
import { ChartSort } from "./sort.entity";
import { ChartFilter } from "./filter.entity";


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

    @OneToMany(() => ChartSort, (sort) => sort.chart)
    sorts: ChartSort[]

    @OneToMany(() => ChartFilter, (sort) => sort.chart)
    filters: ChartFilter[]
    
}
