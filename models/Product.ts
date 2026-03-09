import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a name for this product."],
        maxlength: [60, "Name cannot be more than 60 characters"],
    },
    price: {
        type: Number,
        required: [true, "Please provide a price for this product."],
    },
    category: {
        type: String,
        required: [true, "Please provide a category for this product."],
        enum: ["Stationery", "Electronics", "Crockery", "Disposable Items"],
    },
    image: {
        type: String,
        required: [true, "Please provide an image URL for this product."],
    },
    description: {
        type: String,
        required: [true, "Please provide a description for this product."],
    },
}, {
    timestamps: true,
});

export default models.Product || model("Product", ProductSchema);
