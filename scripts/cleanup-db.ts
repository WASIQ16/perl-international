import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local");
    process.exit(1);
}

async function cleanup() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI!);
        console.log("Connected to MongoDB.");

        const collections = await mongoose.connection.db.listCollections().toArray();
        const productCollection = collections.find(c => c.name === "products");

        if (productCollection) {
            console.log("Checking indexes for 'products' collection...");
            const indexes = await mongoose.connection.db.collection("products").indexes();
            console.log("Current indexes:", JSON.stringify(indexes, null, 2));

            const slugIndex = indexes.find(idx => idx.name === "slug_1");
            if (slugIndex) {
                console.log("Dropping 'slug_1' index...");
                await mongoose.connection.db.collection("products").dropIndex("slug_1");
                console.log("Index 'slug_1' dropped successfully.");
            } else {
                console.log("Index 'slug_1' not found.");
            }
        } else {
            console.log("Collection 'products' not found.");
        }

        console.log("Cleanup completed.");
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
}

cleanup();
