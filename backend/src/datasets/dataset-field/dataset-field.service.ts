import { Injectable } from '@nestjs/common';
import { AddFieldDto } from './dto/add-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DatasetField } from '../entities/dataset-field.entity';
import { Repository } from 'typeorm';
import { SourceService } from 'src/source/source.service';

@Injectable()
export class DatasetFieldService {
    constructor(
        @InjectRepository(DatasetField)
        private readonly datasetFieldRepository: Repository<DatasetField>,
        private readonly sourceService: SourceService
    ) {}

    async updateField(dataset_id: string, field_id: number, dataset_dto: UpdateFieldDto) {
        throw new Error('Method not implemented.');
    }
    async addField(dataset_id: string, fields_dto: AddFieldDto[]) {
        
        throw new Error('Method not implemented.');
    }
    async getFields(dataset_id: string) {
        return await this.datasetFieldRepository.find({where: {dataset_id}});
    }
    async getField(dataset_id: string, field_id: number) {
        return await this.datasetFieldRepository.findOne(
            {
                where: {
                    id: field_id,
                    dataset_id
                }
            }
        );
    }


}
