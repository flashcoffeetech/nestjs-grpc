import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PrismaService } from '../../services/prisma.service';
import { CreateTodo } from './dto/create-todo.dto';
import { TodoById } from './dto/todo-by-id.dto';
import { Todo } from './dto/todo.dto';
import { Todos } from './interfaces/todos.interface';

@Controller('todo')
export class TodoController {
  constructor(private readonly prismaService: PrismaService) {}

  @GrpcMethod('TodoService', 'Create')
  create(data: CreateTodo): Promise<Todo> {
    return this.prismaService.todo.create({ data });
  }

  @GrpcMethod('TodoService', 'FindAll')
  async findAll(): Promise<Todos> {
    const todos = await this.prismaService.todo.findMany();

    return { todos };
  }

  @GrpcMethod('TodoService', 'FindOne')
  findOne(data: TodoById): Promise<Todo> {
    return this.prismaService.todo.findUnique({
      where: { id: data.id },
    });
  }

  @GrpcMethod('TodoService', 'Update')
  update(data: Todo): Promise<Todo> {
    const { id, title, content, isActive } = data;

    return this.prismaService.todo.update({
      where: { id },
      data: {
        isActive,
        ...(title && { title }),
        ...(content && { content }),
      },
    });
  }

  @GrpcMethod('TodoService', 'Remove')
  remove(data: TodoById) {
    return this.prismaService.todo.delete({
      where: {
        id: data.id,
      },
    });
  }
}
