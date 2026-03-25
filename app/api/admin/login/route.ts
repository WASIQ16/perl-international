import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        await dbConnect();

        // Check database for admin
        const admin = await Admin.findOne({ username });

        let isValid = false;

        if (admin && admin.password) {
            // Validate via DB
            isValid = await bcrypt.compare(password, admin.password);
        } else {
            // Fallback to ENV variables for initial setup or if DB is empty
            const envUsername = process.env.ADMIN_USERNAME;
            const envPassword = process.env.ADMIN_PASSWORD;
            
            if (envUsername && envPassword && username === envUsername && password === envPassword) {
                isValid = true;
                
                // If they log in via ENV, but the DB admin exists without a password, update it
                if (admin && !admin.password) {
                    const salt = await bcrypt.genSalt(10);
                    admin.password = await bcrypt.hash(password, salt);
                    await admin.save();
                }
            }
        }

        if (isValid) {
            const cookieStore = await cookies();
            const cookieOpts = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax" as const,
                maxAge: 60 * 60 * 24, // 24 hours
                path: "/",
            };

            cookieStore.set("admin_session", "authenticated", cookieOpts);
            cookieStore.set("admin_role", admin?.role || "superadmin", cookieOpts);

            return NextResponse.json({ success: true, role: admin?.role || "superadmin" });
        }

        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
