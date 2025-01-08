import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AddFieldDto } from './dto/add-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DatasetField, ValueType } from '../entities/dataset-field.entity';
import { In, Repository } from 'typeorm';
import { SourceService } from 'src/source/source.service';
import { DatasetsService } from '../datasets.service';
import { QueryService } from 'src/query/query.service';

@Injectable()
export class DatasetFieldService {
    constructor(
        @InjectRepository(DatasetField)
        private readonly datasetFieldRepository: Repository<DatasetField>,
        private readonly sourceService: SourceService,
        private readonly queryService: QueryService
    ) {}
    //Really stupid solution but user can change this prediction. Alternative solution (still stupid) can be reading value from database and guessing on it buuuttt I do not want to do that.
    //Although the order of return types should be different so that it falls back onto more general types.
    predictValueType(sourceFieldType: string): ValueType {
        const lowerDbType = sourceFieldType.toLowerCase();
        console.log(lowerDbType);
        if (lowerDbType.includes("int") || lowerDbType.includes("serial") || lowerDbType.includes("number")) {
            return ValueType.INTEGER;
        } else if (lowerDbType.includes("float") || lowerDbType.includes("double") || lowerDbType.includes("num") || lowerDbType.includes("decimal")) {
            return ValueType.FLOAT;
        } else if ((lowerDbType.includes("date") && lowerDbType.includes("time")) || lowerDbType.includes("timestamp")) {
            return ValueType.DATETIME;
        } else if (lowerDbType.includes("date")) {
            return ValueType.DATE;
        } else if (lowerDbType.includes("bool") || lowerDbType.includes("bit") || lowerDbType.includes("flag")) {
            return ValueType.BOOLEAN;
        }
        return ValueType.STRING;
    }

    async findFields(datasetId: string, fields: string[]) {
        const res = await this.datasetFieldRepository.find({where: {datasetId, name: In(fields)}});
        const notFound = fields.filter((toAddField) => !res.map((field) => field.name).includes(toAddField)); 
        if (notFound.length != 0) {
            throw new BadRequestException(`Fields with the names [${notFound}] not found`);
        }
        return res;
    }

    async addFields(datasetId: string, username: string, fieldsDto: AddFieldDto[]) {
        
        const test = await this.datasetFieldRepository.find({where: {datasetId, name: In(fieldsDto.map((field) => field.name))}});
        if (test.length != 0) {
            throw new BadRequestException(`Fields with the names [${test.map((field) => field.name)}] already exists`);
        }

        for (const field of fieldsDto) {
            if (!field.isSimple) {
                const formula = field.sourceFields.reduce((prev,sourceField, index) => {
                    return prev.replaceAll("${"+index+"}",`"${sourceField.table}"."${sourceField.column}"`);
                }, field.formula);
                try {
                    await this.queryService.testFormulaField(datasetId, 
                        formula, 
                        [...new Set(field.sourceFields.map((el) => el.table))]
                    );
                } catch (error) {
                    throw new BadRequestException(`Invalid formula: ${error}`);
                }
            }
        }

        const tableColumns = this.getUniqueTableColumns(fieldsDto);
        console.log(tableColumns);
        const dbFieldsInfo = await this.sourceService.ensureSourceFieldsExist(datasetId, tableColumns);
        if (dbFieldsInfo.length === 0) {
            return [];
        }

        
        const datasetFieldLike = fieldsDto.map((field) => {
            return {
                datasetId: datasetId,
                ...field,
                // TODO this is stupid
                sourceFields: field.sourceFields.map((sourceField) => 
                    dbFieldsInfo
                        .find((fieldInfo) => fieldInfo.table === sourceField.table).columnInfo
                        .find((columnInfo) => columnInfo.column === sourceField.column).info
                )
            }
        })
        console.log(datasetFieldLike);
        const datasetFieldSave = await this.datasetFieldRepository.create(datasetFieldLike);
        const datasetFields = this.datasetFieldRepository.save(datasetFieldSave);
        return datasetFields
    }

    async updateField(datasetId: string, fieldId: number, username: string, datasetDto: UpdateFieldDto) {
        const field = await this.datasetFieldRepository.findOne({where: {id: fieldId, datasetId: datasetId}});
        if (!field) {
            throw new BadRequestException('Field not found');
        }

        if (!field.isSimple) {
            for (const field of [datasetDto]) {
                if (!field.isSimple) {
                    const formula = field.sourceFields.reduce((prev,sourceField, index) => {
                        return prev.replaceAll("${"+index+"}",`"${sourceField.table}"."${sourceField.column}"`);
                    }, field.formula);
                    try {
                        await this.queryService.testFormulaField(datasetId, 
                            formula, 
                            [...new Set(field.sourceFields.map((el) => el.table))]
                        );
                    } catch (error) {
                        throw new BadRequestException(`Invalid formula: ${error}`);
                    }
                }
            }
        }
        

        let sourceFields = undefined;
        if (datasetDto.sourceFields) {
            const tableColumns = new Map();
            for (const sourceField of datasetDto.sourceFields) {
                if (!tableColumns.has(sourceField.table)) {
                    tableColumns.set(sourceField.table, []);
                }
                tableColumns.get(sourceField.table).push(sourceField.column);
            }
            const dbFieldsInfo = await this.sourceService.ensureSourceFieldsExist(datasetId, tableColumns);
            sourceFields = dbFieldsInfo.flatMap((fieldInfo) => fieldInfo.columnInfo.flatMap((columnInfo) => columnInfo.info));
        }

        const res = await this.datasetFieldRepository.preload({
            id: fieldId,
            ...datasetDto,
            sourceFields: sourceFields,
        })
        return await this.datasetFieldRepository.save(res);
        // throw new Error('Method not implemented.');
    }
    async getFields(datasetId: string) {
        return await this.datasetFieldRepository.find({where: {datasetId},relations: {sourceFields: {sourceTable: true}}});
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
        for (const field of fields_dto.map((field) => field.sourceFields).flat()) {
            if (!tableColumns.has(field.table)) {
                tableColumns.set(field.table, []);
            }
            if (!tableColumns.get(field.table).includes(field.column)) {
                tableColumns.get(field.table).push(field.column);
            }
        }
        console.log(`Table columns: ${tableColumns}`);
        return tableColumns;
    }
    

}
