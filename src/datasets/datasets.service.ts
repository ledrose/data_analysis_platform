import { Injectable } from '@nestjs/common';
import { Dataset } from './entities/dataset.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddDatasetDto } from './dto/add-dataset.dto';

@Injectable()
export class DatasetsService {
    constructor(
        @InjectRepository(Dataset)
        private readonly datasetRepository: Repository<Dataset>
    ) {}

    async get_by_name(name: string) {
        return this.datasetRepository.findOne({where: {name: name}})
    }

    async create(dataset_dto: AddDatasetDto) {
        throw new Error('Method not implemented.');
    }
}
