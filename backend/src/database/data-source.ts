import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Role, SelectedSpinnerValue, Spinner, SpinnerAmount, SpinnerColor, User } from './entities';
import { InitialSchema1710000000000 } from './migrations/1710000000000-InitialSchema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [Role, User, SpinnerAmount, SpinnerColor, Spinner, SelectedSpinnerValue],
  migrations: [InitialSchema1710000000000],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
});

export default AppDataSource;
