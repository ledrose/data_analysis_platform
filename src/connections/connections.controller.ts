import { Body, Controller, Post } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { AddConnectionDto } from './dto/add-connection.dto';
import {knex} from "knex";

@Controller('connections')
export class ConnectionsController {
    constructor(private readonly connectionsService: ConnectionsService) {}

    @Post()
    async connect(@Body() addConnectionDto: AddConnectionDto) {
        try {
            const res = await this.connectionsService.testConnection(addConnectionDto);
            const saved =  await this.connectionsService.saveConnection(addConnectionDto);
            return {
                status: 'success',
                message: saved
            }
        } catch (error) {
            return {
                status: 'error',
                message: error
            }
        }
    }

    async 

}
