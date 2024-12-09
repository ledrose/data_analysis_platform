import { ConflictException, Injectable } from '@nestjs/common';
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

    async get_dataset(id: string,username: string) {
        return await this.datasetRepository
            .createQueryBuilder('dataset')
            .leftJoin('dataset.connection', 'connection')
            .leftJoin('connection.user', 'user')
            .where('user.username = :username', { username })
            .where('dataset.id = :id', { id })
            .getOne();
    }

    async create(dataset_dto: AddDatasetDto,username: string) {
        const dbDataset = await this.datasetRepository
            .createQueryBuilder('dataset')
            .leftJoin('dataset.connection', 'connection')
            .leftJoin('connection.user', 'user')
            .where('user.username = :username', { username })
            .where('dataset.name = :name', { name: dataset_dto.name })
            .getOne();
        if (dbDataset) {
            throw new ConflictException("Dataset with this name already exists");
        }
        const connection = await this.datasetRepository.create({...dataset_dto});
        return this.datasetRepository.save(connection);
    }
}
