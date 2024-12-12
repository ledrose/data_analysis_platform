import { BadRequestException, Injectable } from '@nestjs/common';
import { AddBaseTableDto, addJoinedTableDto } from './dto/add-table.dto';
import { SourceService } from 'src/source/source.service';
import { DatasetsService } from '../datasets.service';
import { Repository } from 'typeorm';
import { DatasetJoin } from '../entities/dataset-join.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DatasetTableService {

    constructor(
        @InjectRepository(DatasetJoin)
        private readonly datasetJoinRepository: Repository<DatasetJoin>,
        private readonly sourceService: SourceService,
        private readonly datasetService: DatasetsService
    ) {}
    

    async addBaseTable(datasetId: string, username: string, addTableDto: AddBaseTableDto) {
        if (await this.sourceService.isSourceTableExists(datasetId)) {
            throw new BadRequestException("Can't create a base table, there is already one");
        }
        return await this.sourceService.ensureSourceTableExists(datasetId, addTableDto.name);
    }

    async addJoinedTable(datasetId: string, username: string, addTableDto: addJoinedTableDto) {
        if (addTableDto.name == addTableDto.join.rightSourceTable) {
            throw new BadRequestException("Can't join a table to itself");
        }
        await this.sourceService.ensureSourceTableExists(datasetId, addTableDto.name);
        const columnToInsert = new Map();
        columnToInsert.set(addTableDto.name, [addTableDto.join.leftSourceField]);
        columnToInsert.set(addTableDto.join.rightSourceTable, [addTableDto.join.rightSourceField]);
        const dbFieldsInfo = await this.sourceService.ensureSourceFieldsExist(datasetId, columnToInsert);
        const datasetJoin = this.datasetJoinRepository.create({
            datasetId,
            type: addTableDto.join.type,
            leftSourceField: dbFieldsInfo.find((field) => field.table === addTableDto.name).columnInfo[0].info,
            rightSourceField: dbFieldsInfo.find((field) => field.table === addTableDto.join.rightSourceTable).columnInfo[0].info
        })
        return await this.datasetJoinRepository.save(datasetJoin);
    }

}
