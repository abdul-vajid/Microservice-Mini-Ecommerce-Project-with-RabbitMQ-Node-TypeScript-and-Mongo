import { Request, Response, NextFunction } from 'express';
import { UserSchema } from '../utils/validators/UserSchema.ts';
import User from '../models/authModel.ts'
import ErrorResponse from '../utils/handlers/ErrorResponse.ts';
// import Producer from '../producers/RabbitMQProducer.ts';
// import { ValidationError } from 'joi';
import RabbitMQClient from '../rabbitmq/client.ts';
import config from '../config/rabbitmqQueues.ts';
import bcrypt from "bcryptjs";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error, value: data } = await UserSchema.validateUserRegistration.validate(req.body, { abortEarly: true });

    let hashedPassword: string;
    try {
        if (error) {
            return next(ErrorResponse.notFound(error.message));
        }

        const user = await User.findOne({ email: data.email })
        if (user) {
            return next(ErrorResponse.badRequest('Email already registered'));
        }

        const saltRounds: number = Number(process.env.SALT_ROUNDS) || 10;
        const generatedSalt: string = await bcrypt.genSalt(saltRounds);
        hashedPassword = await bcrypt.hash(data.password, generatedSalt);
    } catch (error) {
        return next(error)
    }

    let savedData: any;
    try {
        const newUser = new User({
            email: data.email,
            password: hashedPassword,
        });
        savedData = await newUser.save();
    } catch (error: any) {
        if (error.code === 11000)
            return next(ErrorResponse.badRequest('This email is already registered. Try a different email or log in'));
        return next(error);
    }

    try {
        const result: any = await RabbitMQClient.produce({
            userId: savedData._id,
            email: savedData.email,
            fullname: data.fullname,
            phoneNumber: data.phoneNumber,
            city: data.city,
            country: data.country
        }, config.rabbitMq.queues.userQueue, "register");
        console.log("Result from User in Auth is ", result);
        if (result.isError === true) {
            next(ErrorResponse.forbidden(result.message));
        } else {
            return res.status(201).send({
                success: true,
                status: 201,
                message: "Account created successfully",
                data: result
            })
        }
    } catch (error) {
        return next(ErrorResponse.internalError('Something went wrong, try again!'))
    }
    return next(ErrorResponse.badRequest('Something went wrong, try again!'));
}