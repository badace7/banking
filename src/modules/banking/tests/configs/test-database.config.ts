import { DataSource } from 'typeorm';

export const createDatabaseConnection = (host = 'localhost', port = 5432) => {
  return new DataSource({
    type: 'postgres',
    host: host,
    port: port,
    username: 'user',
    password: 'password',
    database: 'testdb',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    migrationsRun: true,
  });
};

export type TestingDatabase = ReturnType<typeof createDatabaseConnection>;
