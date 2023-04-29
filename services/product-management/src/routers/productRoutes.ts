import express from "express";
import {Request, Response, NextFunction} from 'express';
import {
    helloWorld
} from '../controllers/productController.ts'



const router = express.Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    helloWorld(req, res, next);
});

export default router;