import { entities } from '../entities';
import { DataSource } from 'typeorm';

export const MysqlDataSource = new DataSource({
  type: 'mysql',
  host: (process.env.COOKBOT_MYSQL_HOST as string) || 'localhost',
  port: parseInt(process.env.COOKBOT_MYSQL_PORT as string) || 3306,
  username: (process.env.COOKBOT_MYSQL_USER as string) || 'user',
  password: (process.env.COOKBOT_MYSQL_PW as string) || 'pw',
  database: (process.env.COOKBOT_MYSQL_DB as string) || 'db',
  entities,
  synchronize: true,
  logging: true,
});

export default MysqlDataSource;
