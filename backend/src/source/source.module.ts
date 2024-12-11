import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceTable } from './entities/source-table.entity';
import { SourceField } from './entities/source-field.entity';
import { ConnectionsModule } from 'src/connections/connections.module';

@Module({
  providers: [SourceService],
  imports: [TypeOrmModule.forFeature([SourceTable,SourceField]),ConnectionsModule],
  controllers: [SourceController],
  exports: [SourceService]
})
export class SourceModule {}
