import express, {Request, Response} from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import connectDatabase from './config/database.ts'
// import { corsMiddleware } from './middlewares/cors.ts'
import errorHandler from './handlers/errorHandler.ts';
import userRoutes from './routers/userRoutes.ts'
import consumeMessages from './consumer/testConsumer.ts';

const app = express();
// app.use(corsMiddleware);
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const beforedotenv: string = "dev"
if (process.env.ENV === "dev" || beforedotenv === "dev") app.use(morgan("dev"));

connectDatabase();

app.use("/api/v1/user", userRoutes);

consumeMessages();

app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, status: 404, message: "Not found" });
});

app.use(errorHandler);

const port : any = process.env.PORT
app.listen(port, () => {
    console.log(`Server running... ${port}`)
})