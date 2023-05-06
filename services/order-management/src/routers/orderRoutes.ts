import express from "express";
import {
    addToCart
} from '../controllers/orderController.ts'

const router = express.Router();

router.post('/addToCart', addToCart);


export default router;