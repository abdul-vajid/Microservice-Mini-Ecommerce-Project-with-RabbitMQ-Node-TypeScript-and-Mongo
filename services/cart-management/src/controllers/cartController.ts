import { Request, Response, NextFunction } from 'express';
import Cart from '../models/cartModel.ts';
import ErrorResponse from '../handlers/ErrorResponse.ts';
import { produceForCartDetails } from '../services/producerServices/toProductQueue.ts';



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
        const userId = req.params.userId;
        console.log('req.params.userId', req.params.userId);

        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return ErrorResponse.notFound("Your cart is empty")
        }
        console.log('Debug No : 1');

        const result: any = await produceForCartDetails(cart)
        console.log('consoled result which is get from product service as result of produce method inside get cart api', result)
        res.status(201).send({ success: true, status: 201, cartId: cart._id, data: result });
    } catch (error) {
        return next(error)
    }
}