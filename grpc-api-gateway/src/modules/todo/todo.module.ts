import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [TodoController],
  providers: [
    {
      provide: 'TODO_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'todo',
            protoPath: join(__dirname, 'todo.proto'),
            url: configService.get('GRPC_CONNECTION_URL'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class TodoModule {}
