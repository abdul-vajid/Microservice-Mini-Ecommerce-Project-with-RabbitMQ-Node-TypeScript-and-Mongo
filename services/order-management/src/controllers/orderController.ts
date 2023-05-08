import { Request, Response, NextFunction } from 'express';
import config from '../config/rabbitmqQueues.ts';
import Order from '../models/orderModel.ts';
import ErrorResponse from '../handlers/ErrorResponse.ts';
import RabbitMQClient from '../rabbitmq/client.ts';



export const makeAnOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId, address, orderId} = req.body
        console.log("Degub order api 1, userId : ", userId);
        const products: any = await RabbitMQClient.produceAndWaitForReply({
            userId: userId
        }, config.rabbitMq.queues.cartQueue, "getCartDetails");
        res.status(200).send({ status: 200, success: true, data: products })
    } catch (error) {
        return next(error);
    }
};