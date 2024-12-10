import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { DatasetsGuard } from '../datasets.guard';
import { DatasetFieldsService } from './dataset-fields.service';
import { CreateFieldsDto } from './dto/create-fields.dto';
import { UpdateFieldsDto } from './dto/update-fields.dto';

@Controller('dataset/:dataset_id/fields')
@UseGuards(DatasetsGuard)
export class DatasetFieldsController {
    constructor(
        private readonly datasetsDieldsService: DatasetFieldsService
    ) {}

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async getDatasetField(@Param('dataset_id') dataset_id: string, @Param('id') id: number) {
        return this.datasetsDieldsService.getDatasetField(dataset_id,id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getDatasetFields(@Param('dataset_id') dataset_id: string) {
        return this.datasetsDieldsService.getDatasetFields(dataset_id);
    }

    @Post("/create")
    @HttpCode(HttpStatus.CREATED)
    async addDatasetFields(@Param('dataset_id') dataset_id: string, @Body() datasetFieldsDto: CreateFieldsDto) {
        return this.datasetsDieldsService.createDatasetFields(dataset_id,datasetFieldsDto);
    }

    //TODO finish
    @Post("/update")
    @HttpCode(HttpStatus.OK)
    async updateDatasetField(@Param('dataset_id') dataset_id: string, @Body() datasetFieldsDto: UpdateFieldsDto) {
        return this.datasetsDieldsService.updateDatasetFields(dataset_id,datasetFieldsDto);
    }

    //TODO finish
    @Post("/delete")
    @HttpCode(HttpStatus.OK)
    async deleteDatasetField(@Param('dataset_id') dataset_id: string, @Body() datasetFieldsDto: [number]) {
        return this.datasetsDieldsService.deleteDatasetFields(dataset_id,datasetFieldsDto);
    }

}
