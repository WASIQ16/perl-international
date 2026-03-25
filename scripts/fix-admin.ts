import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetOtp: { type: String },
    otpExpiry: { type: Date },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function checkAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to DB.");

        const admins = await Admin.find({});
        console.log("Current Admins:", admins.map(a => ({ username: a.username, email: a.email })));

        if (admins.length > 0) {
            // Force update the email to what the user provided
            admins[0].email = process.env.SMTP_USER || "wasiq@euroshub.com";
            await admins[0].save();
            console.log(`Updated admin email to: ${admins[0].email}`);
            
            // If they can't login, let's reset the password directly to the env var to be safe
            const bcrypt = require("bcryptjs");
            const salt = await bcrypt.genSalt(10);
            admins[0].password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "password", salt);
            await admins[0].save();
            console.log("Force-reset DB password to match .env.local ADMIN_PASSWORD");
            
        } else {
            console.log("No admins found in DB. Creating one from env vars...");
            const username = process.env.ADMIN_USERNAME || "admin";
            const password = process.env.ADMIN_PASSWORD || "password";
            const email = process.env.SMTP_USER || "admin@example.com";
            
            const bcrypt = require("bcryptjs");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const defaultAdmin = new Admin({
                username,
                email,
                password: hashedPassword,
            });
            await defaultAdmin.save();
            console.log(`Created new Admin. Username: ${username}, Email: ${email}`);
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit(0);
    }
}

checkAdmin();
