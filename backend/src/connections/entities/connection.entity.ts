import { Dataset } from "../../datasets/entities/dataset.entity";
import { Column, Entity, Generated, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum ConnectionType {
    POSTGRESQL = "pg",
    MYSQL = "mysql",
}

@Entity()
export class Connection {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column({
        type: "enum",
        enum: ConnectionType
    })
    type: ConnectionType

    @Column()
    host: string

    @Column()
    port: number

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    database: string

    @ManyToOne(() => Dataset, (dataset) => dataset.connection)
    datasets?: Dataset[]
}
