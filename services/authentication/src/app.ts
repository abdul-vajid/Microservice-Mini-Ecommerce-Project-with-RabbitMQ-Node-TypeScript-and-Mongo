import express, { Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from "dotenv";
import RabbitMQClient from './rabbitmq/client.ts'
import connectDatabase from './config/database.ts'
// import { corsMiddleware } from './middlewares/cors.ts'
import errorHandler from './utils/handlers/errorHandler.ts';
import authRoute from './routers/authRoutes.ts'
import bodyParser from 'body-parser';

const app = express();
// app.use(corsMiddleware);
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.ENV === "dev") app.use(morgan("dev"));

connectDatabase();


app.use("/api/v1/auth", authRoute);

app.get('/test', (req: Request, res: Response)=> {
    RabbitMQClient.produce(req.body)
})

app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, status: 404, message: "Not found" });
});

app.use(errorHandler);

const port: any = process.env.PORT
app.listen(port, () => {
    console.log(`Server running... ${port}`)
    RabbitMQClient.initialize()
})