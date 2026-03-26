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
        default: "",
    },
    images: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
        required: [true, "Please provide a description for this product."],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtual: always return a valid images list (merges legacy `image` field)
ProductSchema.virtual("allImages").get(function () {
    if (this.images && this.images.length > 0) return this.images;
    if (this.image) return [this.image];
    return [];
});

export default models.Product || model("Product", ProductSchema);
