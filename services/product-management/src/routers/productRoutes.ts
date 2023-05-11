import express from "express";
import {
    addProduct,
    getProducts,
    searchProduct
} from '../controllers/productController.ts'

const router = express.Router();

router.post('/addProduct', addProduct);

router.get('/getProducts', getProducts);

router.get('/searchProduct/:search', searchProduct)

export default router;