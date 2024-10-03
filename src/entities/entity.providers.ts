import { DataSource } from 'typeorm';

import * as entities from './index';

export const EntityProviders = Object.values(entities).map((Entity) => ({
	provide: Entity,
	useFactory: (dataSource: DataSource) => dataSource.getRepository(Entity),
	inject: ['dataSource'],
}));
