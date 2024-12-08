import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionDto } from './dto/connection.dto';
import {knex} from "knex";
import SchemaInspector from 'knex-schema-inspector';
import { table } from 'console';

@Controller('connections')
export class ConnectionsController {
    constructor(private readonly connectionsService: ConnectionsService) {}

    @Get(":id")
    async get_by_id(@Param('id') id: string) {
        const knexInstance = await this.connectionsService.getConnection(id);
        const inspector = SchemaInspector(knexInstance);
        const columns = await inspector.columns();
        const tables = await inspector.tables();
        const foreignKeys = await inspector.foreignKeys();
        return {
            tables, columns, foreignKeys
        }
    }


    @Post()
    @HttpCode(HttpStatus.OK)
    async createConnection(@Body() connectionDto: ConnectionDto) {
        return await this.connectionsService.getOrCreateConnectionId(connectionDto);
        // try {
        //     const knexInstance = await this.connectionsService.getConnectionByConfig(connectionDto);
        //     const inspector = SchemaInspector(knexInstance);
        //     const tables = await inspector.tables();
        //     return {
        //             database: knexInstance.client.config.database,
        //             tables: tables
        //         } 
        //     } catch (error) {
        //     return {
        //         status: 'error',
        //         message: error
        //     }
        // }
    }

}
