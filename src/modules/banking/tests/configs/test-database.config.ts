import { DataSource } from 'typeorm';

export const createDatabaseConnection = (host = 'localhost', port = 5432) => {
  return new DataSource({
    name: 'testConnection',
    type: 'postgres',
    host: host,
    port: port,
    username: 'user',
    password: 'password',
    database: 'testdb',
    synchronize: false,
    logging: false,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    migrationsRun: true,
  });
};
