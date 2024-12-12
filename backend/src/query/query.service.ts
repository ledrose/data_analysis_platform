import { Injectable } from '@nestjs/common';
import { ConnectionsService } from 'src/connections/connections.service';
import { QueryDatasetDto } from './dto/query-dataset.dto';
import { DatasetsService } from 'src/datasets/datasets.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dataset } from 'src/datasets/entities/dataset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QueryService {
    constructor(
        private readonly connectionsService: ConnectionsService,
        private readonly datasetService : DatasetsService,
        @InjectRepository(Dataset)
        private readonly datasetRepository: Repository<Dataset>,
        
    ) {}

    async buildQDatasetuery(queryDto: QueryDatasetDto, datasetId: string, paginationDto: PaginationDto, username: string) {
        const dataset = await this.datasetService.get_dataset(datasetId,username);
        // console.log(dataset)
        const knex = await this.connectionsService.getConnection(dataset.connection.id,username);
        const datasetInfo = await this.datasetRepository.findOne({
            where: {id: datasetId},
            relations: {
                joins: {
                    leftSourceField: true,
                    rightSourceField: true
                },
                fields: {
                    sourceField: {
                        sourceTable: true
                    }
                },
                // sourceTables: true
            }            
        });
        const requiredTables = [...new Set(datasetInfo.fields.map((field) => field.sourceField.sourceTable.name))];
        
        // const knexBuilder = knex(datasetInfo.sourceTables[0].name)
        // for (const join of datasetInfo.joins) {
        //     knexBuilder.leftJoin()
        // }

        return datasetInfo;
    }
    

}
