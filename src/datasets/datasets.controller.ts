import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { AddDatasetDto } from './dto/add-dataset.dto';

@Controller('datasets')
export class DatasetsController {
    constructor(private readonly connectionsService: DatasetsService) {}

    @Get(':name')
    async get_by_name(@Param('name') name: string) {
        return this.connectionsService.get_by_name(name);
    }

    @Post()
    async create(@Body() dataset_dto: AddDatasetDto) {
        return this.connectionsService.create(dataset_dto);
    }
}
