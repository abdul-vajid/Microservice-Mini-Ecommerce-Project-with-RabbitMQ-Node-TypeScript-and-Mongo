import { Request, Response, NextFunction } from 'express';
import config from '../config/rabbitmqQueues.ts';
import Cart from '../models/orderModel.ts';
import ErrorResponse from '../handlers/ErrorResponse.ts';
import RabbitMQClient from '../rabbitmq/client.ts';



export const addToCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.body.userId;
        const productId = req.body.productId;
        const productCount = req.body.count || 1;
        const cart = await Cart.findOne({ userId: userId });
        if (cart) {
            const productIndex = cart.products.findIndex(
                (product) => product.productId?.toString() === productId
            );
            if (productIndex >= 0) {
                cart.products[productIndex].count += productCount;
            } else {
                cart.products.push({ productId, count: productCount });
            }
            await cart.save();
        } else {
            const newCart = new Cart({
                userId,
                products: [{ productId, count: productCount }],
            });
            await newCart.save();
        }
        res.status(201).send({ success: true, status: 201, message: "Product added to cart" });
    } catch (error) {
        return next(error);
    }
};

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.userId;
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return ErrorResponse.notFound("Your cart is empty")
        }
        const result: any = await RabbitMQClient.produce({
            products: cart.products
        }, config.rabbitMq.queues.productQueue, "getCartdetails");
        console.log('consoled result which is get from product service as result of produce method inside get cart api', result)
        res.status(201).send({ success: true, status: 201, data: result });
    } catch (error) {
        return next(error)
    }
}

// export const searchProduct = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const products = await Product.find({ productName: req.params.search.toLowerCase() });
//         if (!products) {
//             return ErrorResponse.notFound("Product not found")
//         }
//         res.status(200).send({ success: true, status: 200, data: products })
//     } catch (error) {
//         return next(error)
//     }
// }