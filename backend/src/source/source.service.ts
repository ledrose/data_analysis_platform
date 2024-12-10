import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SourceTable } from './entities/source-table.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceField } from './entities/source-field.entity';

@Injectable()
export class SourceService {
    constructor(
        @InjectRepository(SourceTable)
        private readonly sourceTableRepository: Repository<SourceTable>,
        @InjectRepository(SourceField)
        private readonly sourceFieldRepository: Repository<SourceField>
    ) {}

}
