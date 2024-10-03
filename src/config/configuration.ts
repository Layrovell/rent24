import { DataSourceOptions } from 'typeorm';

type DefaultAppConfig = {
  port: number;
  database: DataSourceOptions;
};

type dbType = 'postgres' | 'mysql' | 'mariadb' | 'sqlite' | 'mssql';

const isCorrectType = (type: string): type is dbType => {
  return ['mysql', 'mariadb', 'postgres', 'sqlite', 'mssql'].includes(type);
};

export default (): DefaultAppConfig => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  database: {
    type: isCorrectType(process.env.DB_TYPE) ? process.env.DB_TYPE : 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rent24',
    logging: ['query', 'error'],
  },
});
