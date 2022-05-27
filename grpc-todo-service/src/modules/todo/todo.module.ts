import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { TodoController } from './todo.controller';

@Module({
  controllers: [TodoController],
  providers: [PrismaService],
})
export class TodoModule {}
