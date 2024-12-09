import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { AddDatasetDto } from './dto/add-dataset.dto';
import { Auth } from 'src/auth/auth.decorator';

@Controller('datasets')
export class DatasetsController {
    constructor(private readonly connectionsService: DatasetsService) {}

    @Get(':id')
    async get_by_name(@Param('id') id: string,@Auth() user: string) {
        return this.connectionsService.get_dataset(id,user);
    }
    
    @Post('create')
    async create(@Body() dataset_dto: AddDatasetDto, @Auth() user: string) {
        return this.connectionsService.create(dataset_dto,user);
    }
}
