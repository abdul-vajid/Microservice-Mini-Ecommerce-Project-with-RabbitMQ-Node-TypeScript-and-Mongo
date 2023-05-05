import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            require: false,
            trim: true
        },
        country: {
            type: String,
            required: false,
            trim: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);