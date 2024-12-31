import { DataSource } from 'typeorm';

export interface DbContextFactory {
  create(): DataSource;
}
