import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotImplementedException, Param, Post, UseGuards } from '@nestjs/common';
import { DatasetTableService } from './dataset-table.service';
import { DatasetsGuard } from '../datasets.guard';
import { AddBaseTableDto, addJoinedTableDto } from './dto/add-table.dto';
import { Auth } from 'src/auth/auth.decorator';

@UseGuards(DatasetsGuard)
@Controller('datasets/:dataset_id/table')
export class DatasetTableController {
    constructor(
        private readonly datasetTableService: DatasetTableService
    ) {}

    @Post("create_base")
    @HttpCode(HttpStatus.CREATED)
    async addBaseTable(@Body() addTableDto: AddBaseTableDto, @Param('dataset_id') datasetId: string, @Auth() username: string) {
        return await this.datasetTableService.addBaseTable(datasetId, username, addTableDto);
    }

    @Post("create_joined")
    @HttpCode(HttpStatus.CREATED)
    async addJoinedTable(@Body() addTableDto: addJoinedTableDto, @Param('dataset_id') datasetId: string, @Auth() username: string) {
        return await this.datasetTableService.addJoinedTable(datasetId, username, addTableDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getTables(@Param('dataset_id') datasetId: string, @Auth() username: string) {
        throw new NotImplementedException();
        // return await this.datasetTableService.getTables(datasetId,username);
    }

    @Delete("delete/:id")
    @HttpCode(HttpStatus.OK)
    async deleteTable(@Param('id') tableId: number, @Param('dataset_id') datasetId: string, @Auth() username: string) {
        // throw new NotImplementedException();
        return await this.datasetTableService.deleteTable(tableId, datasetId, username);
    }


}
