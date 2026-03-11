import mongoose, { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

const OrderSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Please provide the customer's full name."],
    },
    email: {
        type: String,
        required: [true, "Please provide the customer's email."],
    },
    address: {
        type: String,
        required: [true, "Please provide the shipping address."],
    },
    city: {
        type: String,
        required: [true, "Please provide the city."],
    },
    cartItems: [OrderItemSchema],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
}, {
    timestamps: true,
});

export default models.Order || model("Order", OrderSchema);
