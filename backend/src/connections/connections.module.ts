import { Module } from '@nestjs/common';
import { ConnectionsController } from './connections.controller';
import { ConnectionsService } from './connections.service';
import { Connection } from './entities/connection.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConnectionMetadataService } from './connections.metadata.service';
import { Auth } from 'src/auth/auth.decorator';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';

@Module({
  controllers: [ConnectionsController],
  imports: [TypeOrmModule.forFeature([Connection,User])],
  providers: [ConnectionsService, ConnectionMetadataService],
  exports: [ConnectionsService,ConnectionMetadataService]
})

export class ConnectionsModule {}
