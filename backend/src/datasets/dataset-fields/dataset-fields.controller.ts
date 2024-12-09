import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { DatasetsGuard } from '../datasets.guard';

@Controller('dataset/:dataset_id')
@UseGuards(DatasetsGuard)
export class DatasetFieldsController {

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async getDatasetFields() {
        
    }



}
