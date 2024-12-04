import { Injectable } from '@nestjs/common';
import { AddConnectionDto } from './dto/add-connection.dto';
import {knex} from 'knex';
import { error } from 'console';
import e from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from './entities/connection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectionsService {
    constructor(
        @InjectRepository(Connection)
        private readonly connectionRepository: Repository<Connection>
    ) {}

    async testConnection(addConnectionDto: AddConnectionDto) {
        const knexInstance = knex({
            client: addConnectionDto.type.toString(),
            connection: {
                host: addConnectionDto.host,
                port: addConnectionDto.port,
                user: addConnectionDto.username,
                password: addConnectionDto.password,
                database: addConnectionDto.database
            }
        });
        return await knexInstance.raw('select 1+1 as result');
    }

    async saveConnection(addConnectionDto: AddConnectionDto) {
        const connection = this.connectionRepository.create({
            ...addConnectionDto
        });
        return this.connectionRepository.save(connection);
    }
}

