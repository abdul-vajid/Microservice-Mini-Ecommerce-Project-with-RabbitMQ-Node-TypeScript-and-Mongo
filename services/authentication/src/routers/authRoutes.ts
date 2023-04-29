import express from "express";
import {Request, Response, NextFunction} from 'express';
import {
    helloWorld
} from '../controllers/authController.ts'



const router = express.Router();

router.post('/', helloWorld);

export default router;