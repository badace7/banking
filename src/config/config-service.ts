import { ConfigModule, ConfigService } from '@nestjs/config';
import { DB_DEV } from './postgres.config';

export const configService = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => configService.get(DB_DEV),
};
