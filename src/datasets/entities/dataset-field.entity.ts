import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dataset } from "./dataset.entity";

@Entity()
export class DatasetField {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @JoinTable()
    @ManyToOne(() => Dataset, (dataset) => dataset.fields)
    dataset: Dataset;

    @Column()
    formula: string;
}
