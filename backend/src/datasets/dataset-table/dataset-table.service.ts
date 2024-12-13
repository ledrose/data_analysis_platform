import { BadRequestException, Injectable } from '@nestjs/common';
import { AddBaseTableDto, addJoinedTableDto } from './dto/add-table.dto';
import { SourceService } from 'src/source/source.service';
import { DatasetsService } from '../datasets.service';
import { Repository } from 'typeorm';
import { DatasetJoin } from '../entities/dataset-join.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionMetadataService } from 'src/connections/connections.metadata.service';
import { DatasetFieldService } from '../dataset-field/dataset-field.service';
import { AggregateType, ValueType } from '../entities/dataset-field.entity';

@Injectable()
export class DatasetTableService {

    constructor(
        @InjectRepository(DatasetJoin)
        private readonly datasetJoinRepository: Repository<DatasetJoin>,
        private readonly sourceService: SourceService,
        private readonly datasetService: DatasetsService,
        private readonly connectionMetadataService: ConnectionMetadataService,
        private readonly datasetFieldService: DatasetFieldService
    ) {}
    

    async addBaseTable(datasetId: string, username: string, addTableDto: AddBaseTableDto) {
        if (await this.sourceService.isSourceTableExists(datasetId)) {
            throw new BadRequestException("Can't create a base table, there is already one");
        }
        const res =  await this.sourceService.ensureSourceTableExists(datasetId, addTableDto.name);
        const connectionId = (await this.datasetService.getDatasetNoCheck(datasetId))?.connectionId;
        const columns = await this.connectionMetadataService.getColumnsOfTable(connectionId, res.name);
        // const columnToInsert = {"table": res.name, "columnInfo": columns.map((c) => {
        //     return {
        //         "column": c.name,
        //         "info": c
        //     }
        // })};
        const addFieldDto = columns.map((c) => {
            return {
                name: c.name,
                sourceFields: [{
                    table: res.name,
                    column: c.name
                }],
                isSimple: true,
                type: this.datasetFieldService.predictValueType(c.data_type),
                aggregateType: AggregateType.NONE
            }
        });
        this.datasetFieldService.addFields(datasetId, username, addFieldDto);
        // return await this.sourceService.getOrCreateSourceColumns(datasetId, [columnToInsert]);
        // .ensureSourceFieldsExist(datasetId, new Map([[res.name, columns.map((c) => c.name)]]));
        // return res;
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
