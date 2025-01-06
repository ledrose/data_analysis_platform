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
        return (await this.queryService.buildDatasetQuery(queryDto, datasetId, paginationDto, user)).builder.toSQL().sql;
        // throw new NotImplementedException()
    }

    @HttpCode(HttpStatus.OK)
    @Get('dataset/:dataset_id/execute')
    async executeQuery(@Query() paginationDto: PaginationDto, @Param('dataset_id') datasetId: string, @Body() queryDto: QueryDatasetDto, @Auth() user: string) {
        return await (await this.queryService.buildDatasetQuery(queryDto, datasetId, paginationDto, user)).builder;
    }

    

    @HttpCode(HttpStatus.OK)
    @Get('chart/:chart_id/sql')
    async generateQueryChart(@Param('chart_id') chartId: string,@Auth() user: string) {
        return (await this.queryService.buildChartQuery(chartId, user)).builder.toSQL().sql;
    }

    @HttpCode(HttpStatus.OK)
    @Get('chart/:chart_id/execute')
    async executeChartQuery(@Param('chart_id') chartId: string,@Auth() user: string) {
        return await (await this.queryService.buildChartQuery(chartId, user)).builder;
    }


}
