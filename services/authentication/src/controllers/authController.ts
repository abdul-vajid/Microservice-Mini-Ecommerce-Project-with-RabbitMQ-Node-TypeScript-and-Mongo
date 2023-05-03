import { Request, Response, NextFunction } from 'express';
import { UserSchema } from '../utils/validators/UserSchema.ts';
import User from '../models/authModel.ts'
import ErrorResponse from '../utils/handlers/ErrorResponse.ts';
import Producer from '../producers/RabbitMQProducer.ts';
import { ValidationError } from 'joi';
import bcrypt from "bcryptjs";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error, value: data } = await UserSchema.validateUserRegistration.validate(req.body, { abortEarly: true });

    let hashedPassword: string;
    try {
        if (error) {
            return next(ErrorResponse.notFound(error.message));
        }

        const user = await User.findOne({ email: data.email })
        if (user){
            return next(ErrorResponse.badRequest('Email already registered'));
        }
        // const saltRounds: number = Number(process.env.SALT_ROUNDS) || 10;
        // const saltRounds: number = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS || 10));
        const saltRounds: number = Number(process.env.SALT_ROUNDS) || 10;
        const generatedSalt: string = await bcrypt.genSalt(saltRounds);
        hashedPassword = await bcrypt.hash(data.password, generatedSalt);
        // hashedPassword = data.password 
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
        const producer = new Producer()
        await producer.publishMessage('save-userData', {
            fullname: data.fullname,
            phoneNumber: data.phoneNumber,
            city: data.city,
            country: data.country,
        });
        if (savedData) {
            res.status(201).send({
                success: true,
                status: 201,
                message: "Account created successfully",
                data: {
                    email: savedData.email,
                    fullname: savedData.fullname
                }
            })
        }
    } catch (error) {
        return next(ErrorResponse.internalError('Something went wrong, try again!'))
    }
    return next(ErrorResponse.badRequest('Something went wrong, try again!'));
}