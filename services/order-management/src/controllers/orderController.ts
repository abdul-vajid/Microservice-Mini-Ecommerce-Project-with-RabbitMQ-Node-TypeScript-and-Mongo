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
        const { userId, address } = req.body
        console.log("Degub order api 1, userId : ", userId);
        const products: any = await RabbitMQClient.produceAndWaitForReply({
            userId: userId
        }, config.rabbitMq.queues.cartQueue, "getCartDetails");

        const user: any = await RabbitMQClient.produceAndWaitForReply({
            userId: userId
        }, config.rabbitMq.queues.userQueue, "getUserDetails");

        const orderNo: string = "Ecom" + Math.floor(100 + Math.random() * 900).toString()

        const order = new Order({
            userId: userId,
            orderNo: orderNo,
            address: address,
            products: products
        })
        await order.save()
        res.status(200).send({ status: 200, success: true, message: "Order created successfully!", orderNo: order.orderNo })
    } catch (error) {
        console.log(error);
        ErrorResponse.internalError("something went wrong")
    }
};