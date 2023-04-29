import { Request, Response, NextFunction } from 'express';
import  Producer from '../producers/RabbitMQProducer.ts';
import { rabbitMQConfig } from '../config/rabbitmq.ts';
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";


export const helloWorld = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message: string = "Hello world i'm from product-service => app.ts => productRouter.ts => productController.ts";
        const producer = new Producer();
        await producer.publishMessage(req.body.logType, req.body.message);
        console.log("message is send");
        res.status(200).send({ success: true, status: 200, data: message })
    } catch (error) {
        return next(error)
    }
}