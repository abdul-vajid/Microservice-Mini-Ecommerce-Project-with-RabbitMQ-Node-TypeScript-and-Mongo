import { Request, Response, NextFunction } from 'express';
import Product from '../models/productModel.ts';
import ErrorResponse from '../handlers/ErrorResponse.ts';


export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newProduct = new Product({
            productName: req.body.productName,
            category: req.body.category,
            amount: req.body.amount,
        });
        await newProduct.save();
        res.status(200).send({ success: true, status: 200, message: 'Product added successfully' })
    } catch (error) {
        return next(error)
    }
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find({});
        if (!products) {
            return ErrorResponse.notFound("Products not available")
        }
        res.status(200).send({ success: true, status: 200, data: products })
    } catch (error) {
        return next(error)
    }
}

export const searchProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find({ productName: req.params.search.toLowerCase() });
        if (!products) {
            return ErrorResponse.notFound("Product not found")
        }
        res.status(200).send({ success: true, status: 200, data: products })
    } catch (error) {
        return next(error)
    }
}