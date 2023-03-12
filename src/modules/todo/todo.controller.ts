import TodoService from './todo.service';
import TodoRepository from '../../repository/todo.repository';
import { Request, Response, Router } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import { TodoUpdateDTO } from './todo.interfaces';


class TodoController implements Controller{
    public path = '/todos';
    public router = Router();
    
    constructor(private readonly _service: TodoService){
        this.initRoutes();
    }

    private initRoutes():void {
        this.router.route(`${this.path}`)
            .post(this.create)
            .get(this.index);
        
        this.router.route(`${this.path}/:id`)
            .get(this.show)
            .put(this.update)
            .delete(this.delete);
    }

    private create = async (
        req: Request,
        res: Response
    ): Promise<Response|void> => {
        const {title, desc} = req.body;
        try {
            await this._service.createTodo({title, desc});
            return res.status(201).send({
                msg: 'Todos created successfully'
            });
        }
        catch (error) {
            return res.status(500).send({
                msg: 'Something went wrong',
                error
            });
        }
    };

    private index = async (
        req: Request,
        res: Response
    ): Promise<Response|void> => {
        try {
            const todos = await this._service.getTodos();
            return res.status(200).send(todos);
        } catch (error) {
            return res.status(400).send({
                msg: error
            });   
        }
    };

    private show = async (
        req: Request,
        res: Response
    ): Promise<Response|void> => {
        const id = req.params.id;
        const todo = await this._service.getTodoById(id);
        if (!todo) return res.status(404).send({msg: 'Todo not exist'});

        return res.status(200).send(todo);
    };

    private update = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            const findExist = await this._service.getTodoById(id);
            if (!findExist) return res.status(404).send({msg: 'Todo not exist'});

            const {title, desc, isDone} = req.body;

            const updateRequest: TodoUpdateDTO = {
                id,
                title,
                desc,
                isDone
            };
            await this._service.updateTodoById(updateRequest);
            return res.status(200).send({msg: 'success update todo'});

            
        } catch (error) {
            res.status(500).send({msg: 'Something went wrong'});            
        }
    };

    private delete = async (
        req: Request,
        res: Response
    ): Promise<Response|void> => {
        try{
            const id = req.params.id;
            const findExist = await this._service.getTodoById(id);
            if (!findExist) return res.status(404).send({msg: 'Todo not exist'});

            await this._service.deleteTodoById(id);
            return res.status(200).send({msg: 'Todo deleted successfully'});
        }catch (error) {
            return res.status(500).send({msg: 'Something went wrong'});
        }
        
    };
    
}


const todoRepo = new TodoRepository();
const todoService = new TodoService(todoRepo);
const todoController = new TodoController(todoService);


export default todoController as TodoController;