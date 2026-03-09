import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    description: String,
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const imagesToUpload = [
    {
        filePath: "public/stationery_category_webp_1772550778032.png",
        name: "Premium Stationery Set",
        price: 45.0,
        category: "Stationery",
        description: "A complete set of high-quality office and academic stationery.",
    },
    {
        filePath: "public/electronics_category_webp_1772551058709.png",
        name: "Corporate Electronics Bundle",
        price: 299.99,
        category: "Electronics",
        description: "Cutting-edge electronic tools for the modern workplace.",
    },
    {
        filePath: "public/crockery_category_webp_1772551092105.png",
        name: "Luxury Crockery Set",
        price: 150.0,
        category: "Crockery",
        description: "Elegant ceramic and glassware for professional dining.",
    },
    {
        filePath: "public/hero_banner_perl.png",
        name: "Eco-Friendly Disposable Pack",
        price: 35.5,
        category: "Disposable Items",
        description: "Sustainable and biodegradable disposable items for any event.",
    },
];

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI!);
        console.log("Connected to MongoDB.");

        // Clear existing products to avoid duplicates during test
        await Product.deleteMany({});
        console.log("Cleared existing products.");

        for (const item of imagesToUpload) {
            const absolutePath = path.resolve(item.filePath);
            if (!fs.existsSync(absolutePath)) {
                console.warn(`File not found: ${absolutePath}`);
                continue;
            }

            console.log(`Uploading ${item.name} to Cloudinary...`);
            const uploadResult = await cloudinary.uploader.upload(absolutePath, {
                folder: "perl-international/products",
            });

            console.log(`Uploaded! URL: ${uploadResult.secure_url}`);

            const newProduct = new Product({
                name: item.name,
                price: item.price,
                category: item.category,
                image: uploadResult.secure_url,
                description: item.description,
            });

            await newProduct.save();
            console.log(`Saved ${item.name} to MongoDB.`);
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
