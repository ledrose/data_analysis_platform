import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { DatasetFieldService } from './dataset-field.service';
import { DatasetsGuard } from '../datasets.guard';
import { UpdateFieldDto } from './dto/update-field.dto';
import { AddFieldDto } from './dto/add-field.dto';
import { Auth } from 'src/auth/auth.decorator';
import { User } from 'src/auth/entities/user.entity';

@UseGuards(DatasetsGuard)
@Controller('datasets/:dataset_id/fields')
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
    async addField(@Param('dataset_id') dataset_id: string, @Body() dataset_dto: AddFieldDto[], @Auth() username: string) {
        return await this.datasetFieldService.addFields(dataset_id, username, dataset_dto);
    }

    @Post('update/:field_id')
    @HttpCode(HttpStatus.OK)

    async updateField(@Param('dataset_id') dataset_id: string,@Param('field_id') field_id: number,@Body() dataset_dto: UpdateFieldDto, @Auth() username: string) {
        return await this.datasetFieldService.updateField(dataset_id, field_id, username, dataset_dto);
    }

    @Post('delete/:field_id')
    @HttpCode(HttpStatus.OK)
    async deleteField(@Param('dataset_id') dataset_id: string, @Param('field_id') field_id: number) {
        return await this.datasetFieldService.deleteField(dataset_id, field_id);
    }

}
