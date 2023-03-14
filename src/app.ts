import express, { Application } from 'express';
import morgan from 'morgan';
import todoController from './modules/todo/todo.controller';
import prisma from './repository/prisma.db';
import { httpExceptionMiddleware } from './middlewares/http.exception.middleware';

class App {
    private port: number;
    public app: Application;
    
    constructor(port: number) {
        this.app = express();
        this.port = port || 3000;
        this.middlewares();
        this.initControllers();
        this.initHttpException();
    }

    private middlewares(){
        this.app.use(express.json());
        this.app.use(morgan('dev'));
    }
    
    private initControllers(){
        this.app.use('/api', todoController.router);   
    }
    
    private initHttpException(){
        this.app.use(httpExceptionMiddleware);
    }
    
    public async start(): Promise<void> {
        try {
            await prisma.$connect()
                .then(() => console.log('✅ Database connection established'))
                .catch((error) => {
                    console.log('❌ Failed to connect database\n', error);
                    process.exit(1);
                });
               
            this.app.listen(this.port, ()=>{
                console.log(`🚀 Server started at http://localhost:${this.port}`);
            });
            
        } catch (error) {
            console.log('❌ Server failed to start\n', error);
            process.exit(1);
        }
    }
}

export default App;