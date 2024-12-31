import { Injectable } from './../dependencyInjection/decorators';
import { DataSource } from 'typeorm';
import { DbContextFactory } from './dbContextFactory';
import dataSource from './dataSource';

@Injectable()
export class DbContext implements DbContextFactory {
  private dataSource: DataSource;

  create() {
    if (!this.dataSource) {
      this.dataSource = dataSource;
    }

    return this.dataSource;
  }
}
