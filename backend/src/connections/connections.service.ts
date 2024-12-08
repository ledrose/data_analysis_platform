import { BadRequestException, Injectable, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { ConnectionDto } from './dto/connection.dto';
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
    async getConnection(dbId: string): Promise<Knex> {
        if (this.connections.has(dbId)) {
            const connectionInfo = this.connections.get(dbId);
            connectionInfo.lastUsed = Date.now();
            this.resetConnectionTimer(dbId);
            await this.testConnection(connectionInfo.knex); //Can throw exception
            console.log("Reusing connection: ", dbId);
            return connectionInfo.knex;
        }
        const connectionFromDb = await this.connectionRepository.findOne({where: {id: dbId}});
        if (!connectionFromDb) {
            throw new NotFoundException("Id of this connection not found");
        }
        const knexInstance = this.createConnection(connectionFromDb);
        await this.testConnection(knexInstance);
        this.connections.set(dbId, {
            knex: knexInstance,
            lastUsed: Date.now(),
            config: connectionFromDb,
            timer: this.createConnectionTimer(dbId)
        })
        return knexInstance;
    }

    async getOrCreateConnectionId(config: ConnectionDto): Promise<string> {
        return (await this.getConnectionFromDbByConfig(config)).id;
    }

    private async testConnection(knexInstance: Knex) {
        try {
            await knexInstance.raw('select 1+1 as result');
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Database is unavaliable");
        }
    }


    private async getConnectionFromDbByConfig(config: ConnectionDto): Promise<Connection> {
        const dbConnection = await this.connectionRepository.findOne({where: {
            name: config.name,
            password: config.password,
            username: config.username,
            database: config.database,
            host: config.host,
            port: config.port,
            type: config.type
        }});
        if (dbConnection) {
            return dbConnection;
        }
        await this.testConnection(this.createConnection(config));
        const insertedConnection = await this.connectionRepository.create({...config});
        console.log("Created connection in db")
        return await this.connectionRepository.save(insertedConnection);
    }

    //TODO Make argument interface
    private createConnection(connection: ConnectionDto): Knex {
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

    async onModuleDestroy() {
        for (const dbId in this.connections) {
            await this.closeConnection(dbId);
        }
        console.log("All connections closed");
    }

}

