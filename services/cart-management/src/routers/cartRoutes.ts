import express from "express";
import {
    addToCart,
    getCart
} from '../controllers/cartController.ts'



const router = express.Router();

router.post('/addToCart', addToCart);

router.get('/getCart/:userId', getCart);


export default router;