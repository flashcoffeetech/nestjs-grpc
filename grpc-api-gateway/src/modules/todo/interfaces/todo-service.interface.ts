import { Observable } from 'rxjs';
import { CreateTodo } from '../dto/create-todo.dto';
import { TodoById } from '../dto/todo-by-id.dto';
import { Todo } from '../dto/todo.dto';
import { Todos } from './todos.interface';

interface TodoService {
  create(todo: CreateTodo): Observable<Todo>;
  findAll(params: {}): Observable<Todos>;
  findOne(data: TodoById): Observable<Todo>;
  update(todo: Todo): Observable<Todo>;
  remove(data: TodoById): Observable<any>;
}

export default TodoService;
