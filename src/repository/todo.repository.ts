import { Todo, PrismaClient} from '@prisma/client';
import { TodoCreateDTO, TodoUpdateDTO } from '../modules/todo/todo.dtos';
import prisma from './prisma.db';

class TodoRepository {
    private _prisma: PrismaClient;
    constructor(){
        this._prisma = prisma;
    }

    async create(data: TodoCreateDTO): Promise<Todo> {
        return this._prisma.todo.create({
            data: {
                id: data.id,
                title: data.title,
                desc: data.desc,
            }
        });
    }
    
    async findMany(): Promise<Todo[]> {
        return this._prisma.todo.findMany();
    }
    
    async findById(id: string): Promise<Todo | null> {
        return this._prisma.todo.findUnique({
            where: { id: id }
        });
    }

    async update(data: TodoUpdateDTO): Promise<Todo | null> {
        return this._prisma.todo.update({
            where: { id: data.id},
            data: {
                title: data.title,
                desc: data.desc,
                isDone: data.isDone
            }
        });
    }

    async delete(id: string): Promise<Todo>{
        return this._prisma.todo.delete({
            where: {id: id},
        });
    }
    
    async count(): Promise<number> {
        return this._prisma.todo.count();
    }


}

export default TodoRepository;