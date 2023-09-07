import { EntityManager } from 'typeorm';

export const DB_DEV = 'development';

export default () => ({
  development: {
    name: process.env.DB_NAME,
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [process.env.DB_ENTITIES],
    migrations: [process.env.DB_MIGRATIONS],
    migrationTableName: process.env.DB_MIGRATION_TABLE_NAME,
    migrationsRun: true,
  },
});

export const createEntityManagerProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async (entityManager: EntityManager) => entityManager.connection,
  inject: [EntityManager],
};
