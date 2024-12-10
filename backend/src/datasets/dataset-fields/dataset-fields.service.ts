import { Injectable, InternalServerErrorException, NotImplementedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DatasetField, DtoType } from '../entities/dataset-field.entity';
import { BaseDatasetFieldDto, CalculatedDatasetFieldDto, CreateFieldsDto } from './dto/create-fields.dto';
import { Dataset } from '../entities/dataset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateFieldsDto } from './dto/update-fields.dto';

@Injectable()
export class DatasetFieldsService {
    
    constructor (
        @InjectRepository(DatasetField)
        private readonly datasetFieldsRepository: Repository<DatasetField>,
        @InjectRepository(Dataset)
        private readonly datasetRepository: Repository<Dataset>
    ) {}

    async getDatasetField(dataset_id: string, id: number) {
        return await this.datasetFieldsRepository.findOneBy({id});
    }

    async getDatasetFields(dataset_id: string) {
        return await this.datasetFieldsRepository.find({where: {dataset: {id: dataset_id}}});
    }

    async createDatasetFields(dataset_id: string, datasetFieldsDto: CreateFieldsDto) {
        const dataset = await this.datasetRepository.findOneBy({id: dataset_id});
        const fields = datasetFieldsDto.fields.map(field => this.convertDtoToEntity(field, dataset));
        const result = await this.datasetFieldsRepository.create(fields);
        return await this.datasetFieldsRepository.save(result);
    }

    async updateDatasetFields(dataset_id: string, datasetFieldsDto : UpdateFieldsDto) {
        throw new NotImplementedException();
    }

    deleteDatasetFields(dataset_id: string, datasetFieldsDto: [number]) {
        throw new NotImplementedException();
    }

    convertDtoToEntity(field: BaseDatasetFieldDto | CalculatedDatasetFieldDto, dataset: Dataset) {
        if (field.dto_type === DtoType.BASE) {
            const baseField = field as BaseDatasetFieldDto;
            return {...baseField,dataset}
        } else if (field.dto_type === DtoType.CALCULATED) {
            const calculatedField = field as CalculatedDatasetFieldDto;
            return {...calculatedField,dataset}
        } else {
            throw new InternalServerErrorException("Unknown dto type that should have beeen validated earlier");
        }
    }

}


