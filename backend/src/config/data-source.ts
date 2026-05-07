import { DataSource } from 'typeorm';
import { getDataSourceOptions } from './database.config';

export default new DataSource(getDataSourceOptions());
