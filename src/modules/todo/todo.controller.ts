import { NextFunction, Request, Response, Router } from 'express';
import TodoService from './todo.service';
import TodoRepository from '../../repository/todo.repository';
import Controller from '../../utils/interfaces/controller.interface';
import { TodoUpdateDTO } from './todo.dtos';
import { HttpException } from '../../middlewares/http.exception.middleware';
import { CREATED, NOT_FOUND, OK } from '../../utils/statuscodes';
import { Todo } from '@prisma/client';
import { validateRequest } from '../../middlewares/request.validator.middleware';
import { TodoCreateSchema, TodoUpdateSchema } from './todo.request.schema';




class TodoController implements Controller{
    public path = '/todos';
    public router = Router();
    
    constructor(private readonly _service: TodoService){
        this.initRoutes();
    }

    private initRoutes():void {
        this.router.route(`${this.path}`)
            .post(validateRequest(TodoCreateSchema), this.create)
            .get(this.index);
        
        this.router.route(`${this.path}/:id`)
            .get(this.checkTodoExistMiddleware, this.show)
            .put(this.checkTodoExistMiddleware, validateRequest(TodoUpdateSchema), this.update)
            .delete(this.checkTodoExistMiddleware, this.delete);
    }

    checkTodoExistMiddleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const id = req.params.id;
        const findExist = await this._service.getTodoById(id);
        if (!findExist) {
            return next(new HttpException(NOT_FOUND, 'Todo not exist'));
        }
        req.app.locals.todo = findExist;
        return next();
    };

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response|void> => {
        const {title, desc} = req.body;    
        try {
            await this._service.createTodo({title, desc});
            return res.status(CREATED).send({
                msg: 'Todos created successfully'
            });
        }
        catch (error) {
            return next(new HttpException());
        }
    };

    private index = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response|void> => {
        try {
            const todos = await this._service.getTodos();
            return res.status(OK).send(todos);
        } catch (error) {
            return next(new HttpException());
        }
    };

    private show = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response|void> => {
        try{
            const todo: Todo = req.app.locals.todo;
            return res.status(OK).send(todo);
        }catch(error){
            return next(new HttpException());
        }
    };

    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const todo: Todo = req.app.locals.todo;
            const todoId = todo.id;
            const {title, desc, isDone} = req.body;
        
            const updateRequest: TodoUpdateDTO = {
                id: todoId,
                title,
                desc,
                isDone
            };
            await this._service.updateTodoById(updateRequest);
            return res.status(OK).send({msg: 'success update todo'});

            
        } catch (error) {
            return next(new HttpException());
        }
    };

    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response|void> => {
        try{
            const todo: Todo = req.app.locals.todo;
            const todoId = todo.id;

            await this._service.deleteTodoById(todoId);
            return res.status(OK).send({msg: 'Todo deleted successfully'});
        }catch (error) {
            return next(new HttpException());
        }
        
    };
    
}


const todoRepo = new TodoRepository();
const todoService = new TodoService(todoRepo);
const todoController = new TodoController(todoService);


export default todoController as TodoController;

