import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Dataset } from './entities/dataset.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddDatasetDto } from './dto/add-dataset.dto';
import { Connection } from 'src/connections/entities/connection.entity';

@Injectable()
export class DatasetsService {
    constructor(
        @InjectRepository(Dataset)
        private readonly datasetRepository: Repository<Dataset>,
        @InjectRepository(Connection)
        private readonly connectionRepository: Repository<Connection>
    ) {}

    async get_dataset(id: string,username: string) {
        const result =await this.datasetRepository.findOne(
            {
                where: {
                    id: id,
                    connection: {
                        user: {
                            username
                        }
                    }
                },
                join: {
                    alias: 'dataset',
                    leftJoin: {
                        connection: 'dataset.connection',
                        user: 'connection.user'
                    }
                }
            }
        )
            // .createQueryBuilder('dataset')
            // .leftJoin('dataset.connection', 'connection')
            // .leftJoin('connection.user', 'user')
            // .where('user.username = :username', { username })
            // .where('dataset.id = :id', { id })
            // .getOne();
        return result;
    }

    async getDatasetNoCheck(id: string) {
        return await this.datasetRepository.findOne({where: {id}});
    }

    async create(dataset_dto: AddDatasetDto,username: string) {
        const dbDataset = await this.datasetRepository
            .findOne({
                where: {
                    name: dataset_dto.name,
                    connection: {
                        user: {
                            username
                        }
                    }
                },
                join: {
                    alias: 'dataset',
                    leftJoin: {
                        connection: 'dataset.connection',
                        user: 'connection.user'
                    }
                }
            });
        if (dbDataset) {
            throw new ConflictException("Dataset with this name already exists");
        }
        // console.log(dataset_dto);
        const connection = await this.connectionRepository.findOne({where: {id: dataset_dto.connection_id}});
        if (!connection) {
            throw new NotFoundException("Connection not found");
        }
        const dataset = await this.datasetRepository.create({...dataset_dto, connectionId: dataset_dto.connection_id});
        return this.datasetRepository.save(dataset);
    }
}
