import { Request, Response, NextFunction } from 'express';
import  Producer from '../producers/RabbitMQProducer.ts';
import { rabbitMQConfig } from '../config/rabbitmq';
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";


export const helloWorld = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("logType is : ", req.body.logType)
        console.log("message is : ", req.body.message)
        const message: string = "Hello world i'm from auth-service => app.ts => authRouter.ts => authController.ts";
        const producer = new Producer();
        await producer.publishMessage("Info", "this message from producer");
        console.log("message is send");
        res.status(200).send({ success: true, status: 200, data: message })
    } catch (error) {
        return next(error)
    }
}