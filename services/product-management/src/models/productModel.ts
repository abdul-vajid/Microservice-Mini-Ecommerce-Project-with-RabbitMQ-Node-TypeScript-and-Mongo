import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            require: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Product", userSchema);