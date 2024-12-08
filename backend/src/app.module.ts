import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConnectionsModule } from './connections/connections.module';
import { DatasetsModule } from './datasets/datasets.module';
import { GraphsModule } from './graphs/graphs.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import * as Joi from '@hapi/joi';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      DATABASE_HOST: Joi.required(),
      DATABASE_PORT: Joi.number().default(5432),
      DATABASE_NAME: Joi.required(),
      DATABASE_USERNAME: Joi.required(),
      DATABASE_PASSWORD: Joi.required()
    })
  }),
    TypeOrmModule.forRoot({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: true
  }),
  // ServeStaticModule.forRoot({
  //   rootPath: join(__dirname, '..', '..','frontend', 'out'),
  //   renderPath: "/*"
  // }),
  UsersModule, ConnectionsModule, DatasetsModule, GraphsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
