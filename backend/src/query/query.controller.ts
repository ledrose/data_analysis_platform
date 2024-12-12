import { Body, Controller, Get, HttpCode, HttpStatus, NotImplementedException, Param, Post, Query } from '@nestjs/common';
import { ConnectionsService } from 'src/connections/connections.service';
import { QueryDatasetDto } from './dto/query-dataset.dto';
import { Auth } from 'src/auth/auth.decorator';
import { QueryService } from './query.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('query')
export class QueryController {
    constructor(
        private readonly queryService: QueryService
    ) {}


    @HttpCode(HttpStatus.OK)
    @Get('dataset/:dataset_id/sql')
    async generateQuery(@Query() paginationDto: PaginationDto, @Param('dataset_id') datasetId: string, @Body() queryDto: QueryDatasetDto, @Auth() user: string) {
        return await this.queryService.buildQDatasetuery(queryDto, datasetId, paginationDto, user);
        // throw new NotImplementedException()
    }

    @HttpCode(HttpStatus.OK)
    @Post('execute')
    async executeQuery(@Body() queryDto: QueryDatasetDto, @Auth() user: string) {
        throw new NotImplementedException()
    }

    

}
