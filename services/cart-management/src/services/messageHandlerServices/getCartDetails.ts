import ErrorResponse from "../../handlers/ErrorResponse";
import Cart from '../../models/cartModel.ts'
import { produceForCartDetails } from "../producerServices/toProductQueue";

export const getProductDetails = async (message: any) => {
        try {
            console.log(">> >> >> >> inside getProductDetails : first line ");
            console.log(">> >> >> >> message.userId", message.userId);
            const userId =  message.userId
            const cart = await Cart.findOne({ userId: userId });
            console.log(">> >> >> >> console cart inside getProductDetails : ", cart);
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
