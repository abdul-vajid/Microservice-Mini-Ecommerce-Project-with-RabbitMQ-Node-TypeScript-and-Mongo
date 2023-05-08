// import { Request, Response, NextFunction } from "express"
// import authModel from "../models/authModel.ts";
// import db from '../config/database.ts'
// import AuthService from 'auth-service-dev';
// import mongoose from "mongoose";


// export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
//     const authService = new AuthService()
//     await authService.initialize(db, 'userModel', 'my-secret', 20)
//     try {
//         const {email, password} = req.body;
//         const result = authService.generateUserCredentials(email, password);
//         console.log(result);
//     } catch (error) {
//         console.log(error);
//         next(error)
//     }
// }
