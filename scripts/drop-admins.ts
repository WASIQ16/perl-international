import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function resetDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to DB.");

        // Drop the admins collection entirely
        await mongoose.connection.db?.collection("admins").drop();
        console.log("Dropped corrupt 'admins' collection.");
        
    } catch (e: any) {
        if (e.code === 26) {
            console.log("Collection 'admins' did not exist. That's fine.");
        } else {
            console.error("Error:", e);
        }
    } finally {
        process.exit(0);
    }
}

resetDB();
