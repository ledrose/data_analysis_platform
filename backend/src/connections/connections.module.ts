import { Module } from '@nestjs/common';
import { ConnectionsController } from './connections.controller';
import { ConnectionsService } from './connections.service';
import { Connection } from './entities/connection.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConnectionMetadataService } from './connections.metadata.service';

@Module({
  controllers: [ConnectionsController],
  imports: [TypeOrmModule.forFeature([Connection])],
  providers: [ConnectionsService, ConnectionMetadataService]
})

export class ConnectionsModule {}
