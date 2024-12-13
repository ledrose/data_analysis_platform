import { BadRequestException, Injectable } from '@nestjs/common';
import { AddFieldDto } from './dto/add-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DatasetField, ValueType } from '../entities/dataset-field.entity';
import { In, Repository } from 'typeorm';
import { SourceService } from 'src/source/source.service';
import { DatasetsService } from '../datasets.service';

@Injectable()
export class DatasetFieldService {
    constructor(
        @InjectRepository(DatasetField)
        private readonly datasetFieldRepository: Repository<DatasetField>,
        private readonly sourceService: SourceService,
    ) {}
    convertToDatasetFieldType(sourceFieldType: string): ValueType {
        if (sourceFieldType in []) {
        return ValueType.STRING
        }
        return ValueType.STRING
    }

    async addFields(datasetId: string, username: string, fieldsDto: AddFieldDto[]) {
        
        const test = await this.datasetFieldRepository.find({where: {datasetId, name: In(fieldsDto.map((field) => field.name))}});
        if (test.length != 0) {
            throw new BadRequestException(`Fields with the names [${test.map((field) => field.name)}] already exists`);
        }
        // const connectionId = (await this.datasetService.get_dataset(datasetId,username))?.connectionId
        const tableColumns = this.getUniqueTableColumns(fieldsDto);
        console.log(tableColumns);
        const dbFieldsInfo = await this.sourceService.ensureSourceFieldsExist(datasetId, tableColumns);
        if (dbFieldsInfo.length === 0) {
            return [];
        }

        const datasetFieldLike = fieldsDto.map((field) => {
            return {
                datasetId: datasetId,
                // TODO this is stupid
                sourceFieldId: dbFieldsInfo.find((fieldInfo) => fieldInfo.table === field.source_field.table)
                    .columnInfo.find((columnInfo) => columnInfo.column === field.source_field.column)
                    .info.id,
                ...field
            }
        })
        const datasetFieldSave = await this.datasetFieldRepository.create(datasetFieldLike);
        const datasetFields = this.datasetFieldRepository.save(datasetFieldSave);
        return datasetFields
    }

    async updateField(datasetId: string, fieldId: number, username: string, datasetDto: UpdateFieldDto) {
        const field = await this.datasetFieldRepository.findOne({where: {id: fieldId, datasetId: datasetId}});
        if (!field) {
            throw new BadRequestException('Field not found');
        }
        let sourceField = undefined;
        if (datasetDto.source_field) {
            const tableColumns = new Map();
            tableColumns.set(datasetDto.source_field.table, [datasetDto.source_field.column]);
            // const connectionId = (await this.datasetService.get_dataset(datasetId,username))?.connectionId
            const dbFieldsInfo = await this.sourceService.ensureSourceFieldsExist(datasetId, tableColumns);
            sourceField = dbFieldsInfo[0].columnInfo[0].info;
        }

        const res = await this.datasetFieldRepository.preload({
            id: fieldId,
            ...datasetDto,
            sourceFieldId: sourceField?.id
        })
        return await this.datasetFieldRepository.save(res);
        // throw new Error('Method not implemented.');
    }
    async getFields(datasetId: string) {
        return await this.datasetFieldRepository.find({where: {datasetId}});
    }
    async getField(datasetId: string, fieldId: number) {
        return await this.datasetFieldRepository.findOne(
            {
                where: {
                    id: fieldId,
                    datasetId
                }
            }
        );
    }

    async deleteField(datasetId: string, fieldId: number) {
        const field = await this.datasetFieldRepository.findOne({where: {id: fieldId, datasetId: datasetId}});
        if (!field) {
            throw new BadRequestException('Field not found');
        }
        return await this.datasetFieldRepository.remove(field);
    }


    private getUniqueTableColumns(fields_dto: AddFieldDto[]) : Map<string, string[]> {
        const tableColumns = new Map();
        for (const field of fields_dto) {
            if (!tableColumns.has(field.source_field.table)) {
                tableColumns.set(field.source_field.table, []);
            }
            if (!tableColumns.get(field.source_field.table).includes(field.source_field.column)) {
                tableColumns.get(field.source_field.table).push(field.source_field.column);
            }
        }
        console.log(`Table columns: ${tableColumns}`);
        return tableColumns;
    }
    

}
