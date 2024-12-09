import { Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { QueryService } from './query.service';
import { DatasetsModule } from 'src/datasets/datasets.module';

@Module({
  imports: [ConnectionsModule,DatasetsModule],
  controllers: [QueryController],
  providers: [QueryService]
})
export class QueryModule {}
