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
        console.log('inside try save user info in user db');
        console.log('log message.content in save user in user db function ', message.content);
        console.log('log msg in save user in user db function ', message,);

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