import { DataSource } from 'typeorm';
import { config } from './../../config';

const dataSource = new DataSource(config.postgresConfig);

export default dataSource;
