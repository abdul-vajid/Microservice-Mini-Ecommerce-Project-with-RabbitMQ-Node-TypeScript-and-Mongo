import mongoose from "mongoose";
import productModel from "../../models/productModel";

export const getProductDetails = async (products: any) => {
    try {
        console.log('products:', products);
        console.log('Array.isArray(products):', Array.isArray(products));
        const productIds = products.map((product: any) => new mongoose.Types.ObjectId(product.productId));
        const productDetails = await productModel.aggregate([
            { $match: { _id: { $in: productIds } } },
            {
                $addFields: {
                    count: {
                        $reduce: {
                            input: {
                                $map: {
                                    input: products,
                                    as: "product",
                                    in: {
                                        productId: "$$product.productId",
                                        count: "$$product.count"
                                    }
                                }
                            },
                            initialValue: 1,
                            in: {
                                $cond: [
                                    { $eq: [{ $convert: { input: "$$this.productId", to: "objectId" } }, "$_id"] },
                                    "$$this.count",
                                    1
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    productName: 1,
                    category: 1,
                    amount: 1,
                    count: 1,
                    total: { $multiply: ["$amount", "$count"] }
                }
            }
        ]);
        return productDetails;
    } catch (error) {
        console.error(error);
    }
};
