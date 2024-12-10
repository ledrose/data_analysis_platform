import { User } from "src/auth/entities/user.entity";
import { Dataset } from "../../datasets/entities/dataset.entity";
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SourceTable } from "src/source/entities/source-table.entity";

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

    @JoinColumn()
    @ManyToOne(() => User, (user) => user.connections)
    user: User

    @ManyToOne(() => Dataset, (dataset) => dataset.connection)
    datasets: Dataset[]

    @ManyToOne(() => SourceTable, (dataset) => dataset.sourceConnection)
    tables: SourceTable[]
}
