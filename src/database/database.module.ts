import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { EntityProviders } from 'src/entities/entity.providers';

@Module({
	providers: [databaseProviders, ...EntityProviders],
	exports: [...EntityProviders],
})
export class DatabaseModule {}
