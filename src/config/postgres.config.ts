export default () => ({
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_POST, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity{.ts}'],
    synchronize: true,
    migrations: ['dist/migrations/*{.ts}'],
    migrationTableName: 'migrations_banking',
    migrationsRun: true,
  },
});
