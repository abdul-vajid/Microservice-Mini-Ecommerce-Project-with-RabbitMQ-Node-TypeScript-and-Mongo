import express from "express";
import { Request, Response, NextFunction } from 'express';
import {
    registerUser,
    checkUserCredentials
} from '../controllers/authController.ts'



const router = express.Router();

router.post('/register', registerUser);

router.post('/login', checkUserCredentials)

export default router;