import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionDto } from './dto/connection.dto';
import {knex} from "knex";
import SchemaInspector from 'knex-schema-inspector';
import { table } from 'console';
import { ConnectionMetadataService } from './connections.metadata.service';

@Controller('connections')
export class ConnectionsController {
    constructor(
        private readonly connectionsService: ConnectionsService,
        private readonly connectionMetadataService: ConnectionMetadataService
    ) {}

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async get_by_id(@Param('id') id: string) {
        const knexInstance = await this.connectionsService.getConnection(id);
        const columns = await this.connectionMetadataService.getAllColumns(knexInstance);
        const joins = await this.connectionMetadataService.getAllJoins(knexInstance);
        return {
            columns, joins
        }
    }


    @Post()
    @HttpCode(HttpStatus.OK)
    async createConnection(@Body() connectionDto: ConnectionDto) {
        return await this.connectionsService.getOrCreateConnectionId(connectionDto);
    }

}
