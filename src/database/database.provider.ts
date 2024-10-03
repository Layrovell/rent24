import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const databaseProviders = {
	provide: 'dataSource',
	useFactory: async (configService: ConfigService) => {
		const dbConf = configService.get<DataSourceOptions>('database');
		const dataSource = new DataSource({
			...dbConf,
			entities: [__dirname + '/../entities/!(base).entity.*(ts|js)'],
			migrations: [__dirname + '/../../migrations/*.ts'],
			migrationsTableName: 'migration_table',
			synchronize: false,
		});
		return dataSource.initialize();
	},
	inject: [ConfigService],
};
