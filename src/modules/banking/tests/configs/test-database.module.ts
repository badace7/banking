import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestContainersType } from './test-containers.config';

@Module({})
export class TestDatabaseModule {
  static forRoot(container: TestContainersType): DynamicModule {
    return {
      module: TestDatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: container.getHost(),
          port: container.getMappedPort(5432),
          username: 'user',
          password: 'password',
          database: 'testdb',
          entities: ['src/**/*.entity.ts'],
          migrations: ['src/migrations/*.ts'],
          migrationsRun: true,
        }),
      ],
    };
  }
}
