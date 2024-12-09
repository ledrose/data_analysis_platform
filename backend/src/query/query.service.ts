import { Injectable } from '@nestjs/common';
import { ConnectionsService } from 'src/connections/connections.service';
import { QueryDatasetDto } from './dto/query-dataset.dto';
import { DatasetsService } from 'src/datasets/datasets.service';

@Injectable()
export class QueryService {
    constructor(
        private readonly connectionsService: ConnectionsService,
        private readonly datasetService : DatasetsService,
    ) {}

    async buildQDatasetuery(queryDto: QueryDatasetDto, username: string) {
        const dataset = await this.datasetService.get_dataset(queryDto.dataset_id,username);
        const knex = await this.connectionsService.getConnection(dataset.connection.id,username);

        return knex
    }
    

}
