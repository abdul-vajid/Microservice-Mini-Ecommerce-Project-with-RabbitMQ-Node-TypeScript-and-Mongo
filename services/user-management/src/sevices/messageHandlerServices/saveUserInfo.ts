import { UserSchema } from "../../utils/inputValidators/userSchema";
import User from "../../models/userModel.ts"

export const saveUserInfoInDb = async (message: any) => {
    type Response = {
        isError: boolean,
        message?: string,
        data?: any
    }
    let response: Response = { isError: false }
    try {
        const newUser = new User({
            userId: message.userId,
            email: message.email,
            fullname: message.fullname,
            phoneNumber: message.phoneNumber,
            country: message.country,
            city: message.city
        });
        await newUser.save();
        response.isError = false;
        response.message = 'user info saved in user db';
        return response;
    } catch (error) {
        response.isError = true;
        response.message = 'something went wrong in adding user db';
        response.data = error
        return response;
    }
}