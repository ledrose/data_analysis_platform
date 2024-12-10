import { Column, Entity, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dataset } from "./dataset.entity";

@Entity()
export class DatasetJoin {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    table_joined: string

    @Column()
    field_original: string

    @Column()
    field_joined: string

    @JoinTable()
    @OneToMany(() => Dataset, (dataset) => dataset.joins)
    dataset: Dataset
}

