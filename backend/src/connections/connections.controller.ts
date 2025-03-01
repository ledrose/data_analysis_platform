import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionDto } from './dto/connection.dto';
import { ConnectionMetadataService } from './connections.metadata.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Auth } from 'src/auth/auth.decorator';
import { UpdateConnectionDto } from './dto/update-connection.dto';

@Controller('connections')
export class ConnectionsController {
    constructor(
        private readonly connectionsService: ConnectionsService,
        private readonly connectionMetadataService: ConnectionMetadataService
    ) {}

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async get_by_id(@Param('id') id: string, @Auth() user: string) {
        const knexInstance = await this.connectionsService.getConnection(id, user);
        console.log(knexInstance.client.config);
        const columns = await this.connectionMetadataService.getAllColumns(knexInstance);
        const joins = await this.connectionMetadataService.getAllJoins(knexInstance);
        return {
            columns, joins
        }
    }

    @Get()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async get_all_connections(@Auth() user: string) {
        return this.connectionsService.getConnections(user);
    }


    @Post('create')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async createConnection(@Body() connectionDto: ConnectionDto, @Auth() user: string) {
        // console.log(`Creating connection for user ${user}`)
        return {
            id: await this.connectionsService.getOrCreateConnectionId(connectionDto,user)
        };
    }

    @Post('update/:id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateConnection(@Param('id') connectionId: string, @Body() connectionDto: UpdateConnectionDto, @Auth() user: string) {
        // console.log(`Updating connection for user ${user}`)
        return await this.connectionsService.updateConnection(connectionId,connectionDto,user)
    }

    @Post('delete/:id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteConnection(@Param('id') connectionId: string, @Auth() user: string) {
        // console.log(`Updating connection for user ${user}`)
        return await this.connectionsService.deleteConnection(connectionId,user)
    }

}
