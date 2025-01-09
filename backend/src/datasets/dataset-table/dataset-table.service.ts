import { BadRequestException, Injectable } from '@nestjs/common';
import { AddBaseTableDto, AddJoinedTableDto } from './dto/add-table.dto';
import { SourceService } from 'src/source/source.service';
import { DatasetsService } from '../datasets.service';
import { Repository } from 'typeorm';
import { DatasetJoin } from '../entities/dataset-join.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionMetadataService } from 'src/connections/connections.metadata.service';
import { DatasetFieldService } from '../dataset-field/dataset-field.service';
import { AggregateType, ValueType } from '../entities/dataset-field.entity';
import { Dataset } from '../entities/dataset.entity';

@Injectable()
export class DatasetTableService {

    constructor(
        @InjectRepository(DatasetJoin)
        private readonly datasetJoinRepository: Repository<DatasetJoin>,
        // @InjectRepository(Dataset)
        // private readonly datasetRepository: Repository<Dataset>,
        private readonly sourceService: SourceService,
        private readonly datasetService: DatasetsService,
        private readonly connectionMetadataService: ConnectionMetadataService,
        private readonly datasetFieldService: DatasetFieldService
    ) {}
    

    // async getTables(datasetId: string,username: string) {
    //     this.datasetRepository.findOne(
    //         {where: {id: datasetId}}
    //     );
    //     throw new Error('Method not implemented.');
    // }

    async addBaseTable(datasetId: string, username: string, addTableDto: AddBaseTableDto) {
        if (await this.sourceService.isSourceTableExists(datasetId)) {
            throw new BadRequestException("Can't create a base table, there is already one");
        }
        const res =  await this.sourceService.ensureSourceTableExists(datasetId, addTableDto.name);
        const connectionId = (await this.datasetService.getDatasetNoCheck(datasetId))?.connectionId;
        const columns = await this.connectionMetadataService.getColumnsOfTable(connectionId, res.name);
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
        return await this.datasetFieldService.addFields(datasetId, username, addFieldDto);
    }

    async addJoinedTable(datasetId: string, username: string, addTableDto: AddJoinedTableDto) {
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

    async deleteTable(tableId: number, datasetId: string, username: string) {
        return await this.sourceService.deleteSourceTable(datasetId, tableId);
    }


}

