import express from "express";
import {
    makeAnOrder
} from '../controllers/orderController.ts'

const router = express.Router();

router.post('/makeAnOrder', makeAnOrder);


export default router;