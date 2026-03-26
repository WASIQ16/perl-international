const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local");
    process.exit(1);
}

async function cleanup() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB.");

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const hasProducts = collections.some(c => c.name === "products");

        if (hasProducts) {
            console.log("Checking indexes for 'products' collection...");
            const collection = db.collection("products");
            const indexes = await collection.indexes();
            console.log("Current indexes:", JSON.stringify(indexes, null, 2));

            const slugIndex = indexes.find(idx => idx.name === "slug_1");
            if (slugIndex) {
                console.log("Dropping 'slug_1' index...");
                await collection.dropIndex("slug_1");
                console.log("Index 'slug_1' dropped successfully.");
            } else {
                console.log("Index 'slug_1' not found. It might be under a different name or already dropped.");
            }
        } else {
            console.log("Collection 'products' not found.");
        }

        await mongoose.disconnect();
        console.log("Cleanup completed.");
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
}

cleanup();
