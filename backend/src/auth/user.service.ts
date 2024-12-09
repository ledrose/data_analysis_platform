import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findOne(username: string) {
        return this.userRepository.findOne({where: {username}});
    }

    async create(username: string, passwordHash: string){
        const user = this.userRepository.create({username, passwordHash});
        return this.userRepository.save(user);
    }

    async isUserHasDatasetAccess(username: string, dataset_id: string) {
        return await this.userRepository.createQueryBuilder('user')
            .leftJoin('user.connections', 'connection')
            .leftJoin('connection.datasets', 'dataset')
            .where('user.username = :username', { username })
            .where('dataset.id = :dataset_id', { dataset_id })
            .getOne();
    }
}
