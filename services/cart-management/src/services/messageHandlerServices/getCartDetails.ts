import ErrorResponse from "../../handlers/ErrorResponse";
import Cart from '../../models/cartModel.ts'
import { produceForCartDetails } from "../producerServices/toProductQueue";

export const getProductDetails = async (message: any) => {
        try {
            const userId =  message.userId
            const cart = await Cart.findOne({ userId: userId });
            if (!cart) {
                return ErrorResponse.notFound("Your cart is empty")
            }
            const result: any = produceForCartDetails(cart)
            return result
        } catch (error) {
            console.error(error);
            return error
        }
};
