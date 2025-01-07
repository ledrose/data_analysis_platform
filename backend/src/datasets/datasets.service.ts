import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Dataset } from './entities/dataset.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddDatasetDto } from './dto/add-dataset.dto';
import { Connection } from 'src/connections/entities/connection.entity';
import { UpdateConnectionDto } from 'src/connections/dto/update-connection.dto';

@Injectable()
export class DatasetsService {    
    constructor(
        @InjectRepository(Dataset)
        private readonly datasetRepository: Repository<Dataset>,
        @InjectRepository(Connection)
        private readonly connectionRepository: Repository<Connection>
    ) {}


    async delete(datasetId: string) {
        const dataset = await this.datasetRepository.findOne({where: {id: datasetId}});
        if (!dataset) {
            throw new NotFoundException("Dataset not found");
        }
        return await this.datasetRepository.remove(dataset);
    }

    async update(datasetId: string, datasetDto: UpdateConnectionDto, user: string) {
        const dataset = await this.datasetRepository.preload({
            id: datasetId,
            ...datasetDto
        })
        return await this.datasetRepository.save(dataset);
    }

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
                relations: {
                    fields: true,
                    joins: {
                        leftSourceField: {
                            sourceTable: true
                        },
                        rightSourceField: {
                            sourceTable: true
                        }
                    },
                    sourceTables: true
                }
            }
        )
        return result;
    }

    async getAllDatasets(user: string) {
        return await this.datasetRepository.find({
            relations: {
              connection: true  
            },
            where: {connection: {user: {username: user}}}});
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
        const connection = await this.connectionRepository.findOne({where: {id: dataset_dto.connectionId}});
        if (!connection) {
            throw new NotFoundException("Connection not found");
        }
        const dataset = await this.datasetRepository.create({...dataset_dto, connectionId: dataset_dto.connectionId});
        return this.datasetRepository.save(dataset);
    }
}
