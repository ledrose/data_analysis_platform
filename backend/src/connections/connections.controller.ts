import { Body, Controller, Post } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { AddConnectionDto } from './dto/add-connection.dto';
import {knex} from "knex";
import SchemaInspector from 'knex-schema-inspector';
import { table } from 'console';

@Controller('connections')
export class ConnectionsController {
    constructor(private readonly connectionsService: ConnectionsService) {}

    @Post()
    async connect(@Body() addConnectionDto: AddConnectionDto) {
        try {
            const knexInstance = await this.connectionsService.getConnection(addConnectionDto);
            const inspector = SchemaInspector(knexInstance);
            const tables = await inspector.tables();
            return {
                status: 'success',
                message: {
                    database: knexInstance.client.config.database,
                    tables: tables
                } 
            }
        } catch (error) {
            return {
                status: 'error',
                message: error
            }
        }
    }

}
