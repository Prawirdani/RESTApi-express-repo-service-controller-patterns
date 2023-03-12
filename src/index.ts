import App from './app';
import 'dotenv/config';


const app = new App(Number(process.env.PORT));

app.start();