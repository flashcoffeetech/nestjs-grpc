import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  OnModuleInit,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateTodo } from './dto/create-todo.dto';
import { Todo } from './dto/todo.dto';
import TodoService from './interfaces/todo-service.interface';

@Controller('todo')
@UseInterceptors(ClassSerializerInterceptor)
export class TodoController implements OnModuleInit {
  private todoService: TodoService;

  constructor(@Inject('TODO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.todoService = this.client.getService<TodoService>('TodoService');
  }

  @Post()
  create(@Body() todo: CreateTodo) {
    return this.todoService.create(todo);
  }

  @Get()
  findAll() {
    return this.todoService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne({ id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodo: Todo) {
    if (+id === updateTodo.id) {
      return this.todoService.update(updateTodo);
    }

    throw new HttpException('Todo ID does not match!', HttpStatus.BAD_REQUEST);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove({ id: +id });
  }
}
