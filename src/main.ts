import { NestFactory } from '@nestjs/core';
import { AppModule } from './config/nestModules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8080);
}
bootstrap();
