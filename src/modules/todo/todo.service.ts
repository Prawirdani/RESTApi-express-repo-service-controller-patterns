import TodoRepository from '../../repository/todo.repository';
import { customAlphabet } from 'nanoid';
import { TodoCreateDTO, TodoUpdateDTO } from './todo.interfaces';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 30);

class TodoService {
    constructor(private readonly _repo: TodoRepository){}

    async createTodo(requestData: {title: string, desc: string}){
        const data: TodoCreateDTO = {
            id: nanoid(),
            title: requestData.title,
            desc: requestData.desc
        };

        return this._repo.create(data);
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

    // async findExist(id: string) {
    //     const exist = await this.getTodoById(id);
    //     if (!exist) return false;
    //     return true;
    // }

    async countTodos(){
        return this._repo.count();
    }
}

export default TodoService;