import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, password } = await req.json();

        // Check if any admin exists in the database
        const adminCount = await Admin.countDocuments();
        let validUsernameStr = process.env.ADMIN_USERNAME;
        let validPasswordStr = process.env.ADMIN_PASSWORD;

        if (adminCount === 0) {
            // First time setup: seed the db using the env variables if they exist
            if (validUsernameStr && validPasswordStr) {
                const passwordHash = await bcrypt.hash(validPasswordStr, 10);
                await Admin.create({
                    username: validUsernameStr,
                    passwordHash,
                });
            }
        }

        // Fetch the admin user (we assume there's only one master admin, or we search by username)
        const adminUser = await Admin.findOne({ username });

        let isAuthenticated = false;

        if (adminUser) {
            // Compare hashed password
            const isMatch = await bcrypt.compare(password, adminUser.passwordHash);
            if (isMatch) {
                isAuthenticated = true;
            }
        } else if (adminCount === 0 && username === validUsernameStr && password === validPasswordStr) {
            // Fallback for first time login before DB is populated
            isAuthenticated = true;
        }

        if (isAuthenticated) {
            // Set a simple session cookie
            (await cookies()).set("admin_session", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 24 hours
                path: "/",
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
