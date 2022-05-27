import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'todo',
      protoPath: join(__dirname, 'modules/todo/todo.proto'),
      url: configService.get('GRPC_CONNECTION_URL'),
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
