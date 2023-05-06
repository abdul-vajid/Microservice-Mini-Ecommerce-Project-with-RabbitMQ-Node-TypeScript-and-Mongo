import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
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

export default mongoose.model("Cart", cartSchema);