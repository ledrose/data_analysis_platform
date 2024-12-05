import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { AddConnectionDto } from './dto/add-connection.dto';
import {Knex, knex} from 'knex';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from './entities/connection.entity';
import { Repository } from 'typeorm';

interface ConnectionInfo {
    knex: Knex,
    lastUsed: number,
    config: Connection,
    timer: NodeJS.Timeout | null
}

@Injectable()
export class ConnectionsService implements OnModuleDestroy{
    constructor(
        @InjectRepository(Connection)
        private readonly connectionRepository: Repository<Connection>
    ) {}
    private connections: Map<string,ConnectionInfo> = new Map();
    private readonly CONNECTION_TIMEOUT = 10*60*1000;


    //Exception in case of failed connection to database
    ///TODO unite Ids in database and hash table
    async getConnection(config: AddConnectionDto): Promise<Knex> {
        const dbId = this.generateId(config);
        if (this.connections.has(dbId)) {
            const connectionInfo = this.connections.get(dbId);
            connectionInfo.lastUsed = Date.now();
            this.resetConnectionTimer(dbId);
            try {
                await this.testConnection(connectionInfo.knex);
            } catch (error) {
                console.log("Connection to database failed, closing connection: ", error);
                await this.closeConnection(dbId);
                return await this.getConnection(config);
            }
            console.log("Reusing connection: ", dbId);
            return connectionInfo.knex;
        }
        const knexInstance = this.createConnection(config);
        await this.testConnection(knexInstance);
        const configFromDb = await this.getConnectionFromDb(config);
        this.connections.set(dbId, {
            knex: knexInstance,
            lastUsed: Date.now(),
            config: configFromDb,
            timer: this.createConnectionTimer(dbId)
        })
        return knexInstance;
    }

    private async testConnection(knexInstance: Knex) {
        return await knexInstance.raw('select 1+1 as result');
    }


    private async getConnectionFromDb(config: AddConnectionDto): Promise<Connection> {
        const dbConnection = await this.connectionRepository.findOne({where: {name: config.name}});
        if (dbConnection) {
            return dbConnection;
        }
        const insertedConnection = await this.connectionRepository.create({...config});
        console.log("Created connection in db")
        return await this.connectionRepository.save(insertedConnection);
    }

    private createConnection(connection: AddConnectionDto): Knex {
        return knex({
            client: connection.type.toString(),
            connection: {
                host: connection.host,
                port: connection.port,
                user: connection.username,
                password: connection.password,
                database: connection.database
            },
            pool: {
                min: 0,
                max: 3
            }
        });
    }

    private resetConnectionTimer(dbId: string) {
        const connectionInfo = this.connections.get(dbId);
        if (connectionInfo && connectionInfo.timer) {
            clearTimeout(connectionInfo.timer);
            connectionInfo.timer = this.createConnectionTimer(dbId);
        }
    }

    private createConnectionTimer(dbId: string): NodeJS.Timeout {
        return setTimeout(() => {
            this.closeConnection(dbId);
            console.log("Active connection closed")
        },this.CONNECTION_TIMEOUT)
    }

    private async closeConnection(dbId: string) {
        const connectionInfo = this.connections.get(dbId);
        if (connectionInfo) {
            connectionInfo.knex.destroy();
            clearTimeout(connectionInfo.timer);
            this.connections.delete(dbId);
        }
    }

    private generateId(config: AddConnectionDto): string {
        return this.hashString(JSON.stringify(config));
    }

    private hashString(string: string): string {
        let hash = 0;
        let char;
        if (string.length == 0) return hash.toString();
    
        for (let i = 0; i < string.length; i++) {
            char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
    
        return hash.toString();
    }

    async onModuleDestroy() {
        for (const dbId in this.connections) {
            await this.closeConnection(dbId);
        }
        console.log("All connections closed");
    }

}

