import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import postgresConfig from './postgres.config';
import { configService } from './config-service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [postgresConfig],
    }),
    TypeOrmModule.forRootAsync(configService),
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class DatabaseModule {}
