import express from "express";
import { Request, Response, NextFunction } from 'express';
import {
    registerUser
} from '../controllers/authController.ts'



const router = express.Router();

router.post('/', registerUser);

export default router;