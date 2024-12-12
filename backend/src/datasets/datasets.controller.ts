import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { AddDatasetDto } from './dto/add-dataset.dto';
import { Auth } from 'src/auth/auth.decorator';
import { DatasetsGuard } from './datasets.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('datasets')
export class DatasetsController {
    constructor(private readonly datasetsService: DatasetsService) {}

    @UseGuards(DatasetsGuard)
    @Get(':dataset_id')
    @HttpCode(HttpStatus.OK)
    async get_by_name(@Param('dataset_id') id: string,@Auth() user: string) {
        return this.datasetsService.get_dataset(id,user);
    }

    @UseGuards(AuthGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    async get_all_datasets(@Auth() user: string) {
        return this.datasetsService.getAllDatasets(user);
    }

    @UseGuards(AuthGuard)
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dataset_dto: AddDatasetDto, @Auth() user: string) {
        return this.datasetsService.create(dataset_dto,user);
    }
}
