import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
            trim: true,
        },
        orderNo: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        products: [{
            productId: mongoose.Types.ObjectId,
            count: Number,
        }],
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);