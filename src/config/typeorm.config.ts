import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

interface IDBConfig {
  type: string;
  port: number;
  host: string;
  username: string;
  password: string;
  synchronize: string;
  database: string;
}

const dbConfig: IDBConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: 5432,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
