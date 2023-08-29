import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestContainersType } from './test-containers.config';
import { dotenvConfig } from 'src/config/dot-env';

@Module({})
export class TestDatabaseModule {
  static forRoot(container: TestContainersType): DynamicModule {
    dotenvConfig('.env.test');
    return {
      module: TestDatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: container.getHost(),
          port: container.getMappedPort(5432),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [process.env.DB_ENTITIES],
          migrations: [process.env.DB_MIGRATIONS],
          migrationsRun: true,
        }),
      ],
    };
  }
}
