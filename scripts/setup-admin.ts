import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["superadmin", "admin"], default: "admin" },
    password: { type: String, required: true },
    resetOtp: { type: String },
    otpExpiry: { type: Date },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function setupAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to DB.");

        // Drop existing admins collection to start clean
        try {
            await mongoose.connection.db?.collection("admins").drop();
            console.log("Dropped existing admins collection.");
        } catch (e: any) {
            if (e.code === 26) {
                console.log("No existing admins collection. Starting fresh.");
            }
        }

        // Create Behzad as superadmin with correct email
        const username = process.env.ADMIN_USERNAME || "Behzad";
        const password = process.env.ADMIN_PASSWORD || "Behzad@119913";
        const email = "wasiq161102@gmail.com";

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new Admin({
            username,
            email,
            role: "superadmin",
            password: hashedPassword,
        });
        await admin.save();

        console.log(`\n✅ Super Admin Created Successfully!`);
        console.log(`   Username: ${username}`);
        console.log(`   Email: ${email}`);
        console.log(`   Role: superadmin`);
        console.log(`   Password: (from ADMIN_PASSWORD env var)\n`);

    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit(0);
    }
}

setupAdmin();
