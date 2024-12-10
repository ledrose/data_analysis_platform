import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { DatasetFieldService } from './dataset-field.service';
import { DatasetsGuard } from '../datasets.guard';
import { UpdateFieldDto } from './dto/update-field.dto';
import { AddFieldDto } from './dto/add-field.dto';

@UseGuards(DatasetsGuard)
@Controller('dataset/:dataset_id/field')
export class DatasetFieldController {
    constructor(
        private readonly datasetFieldService: DatasetFieldService
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getFields(@Param('dataset_id') dataset_id: string) {
        return await this.datasetFieldService.getFields(dataset_id);
    }

    @Get(':field_id')
    @HttpCode(HttpStatus.OK)
    async getField(@Param('dataset_id') dataset_id: string, field_id: number) {
        return await this.datasetFieldService.getField(dataset_id, field_id);
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async addField(@Param('dataset_id') dataset_id: string, @Body() dataset_dto: AddFieldDto[]) {
        return await this.datasetFieldService.addField(dataset_id, dataset_dto);
    }

    @Post('update/:field_id')
    @HttpCode(HttpStatus.OK)

    async updateField(@Param('dataset_id') dataset_id: string,@Param('field_id') field_id: number,@Body() dataset_dto: UpdateFieldDto) {
        return await this.datasetFieldService.updateField(dataset_id, field_id, dataset_dto);
    }

}
