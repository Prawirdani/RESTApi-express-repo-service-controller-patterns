import TodoRepository from '../../repository/todo.repository';
import { customAlphabet } from 'nanoid';
import { TodoCreateDTO, TodoUpdateDTO } from './todo.dtos';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 30);

class TodoService {
    constructor(private readonly _repo: TodoRepository){}

    async createTodo(request: {title: string, desc: string}){
        const newTodo: TodoCreateDTO = {
            id: nanoid(),
            title: request.title,
            desc: request.desc
        };

        const x: Omit<TodoCreateDTO, 'id'> = newTodo;
        console.log(x);
        return this._repo.create(newTodo);
    }

    async getTodos(){
        return this._repo.findMany();
    }

    async getTodoById(id: string){
        return this._repo.findById(id);
    }

    async updateTodoById(request: TodoUpdateDTO){
        return this._repo.update(request);
    }

    async deleteTodoById(id: string) {
        return this._repo.delete(id);
    }

    async countTodos(){
        return this._repo.count();
    }
}

export default TodoService;