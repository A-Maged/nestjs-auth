import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { dataSourceOptionsFactory } from './options';

config();

const configService = new ConfigService();

export default new DataSource(dataSourceOptionsFactory(configService));
