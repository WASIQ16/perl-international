import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const resetAuthCookie = cookieStore.get("password_reset_auth");

        if (!resetAuthCookie || resetAuthCookie.value !== "authorized") {
            return NextResponse.json({ error: "Unauthorized. Please verify OTP first." }, { status: 403 });
        }

        const { newPassword } = await req.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
        }

        await dbConnect();
        const username = process.env.ADMIN_USERNAME;

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return NextResponse.json({ error: "Admin account not found" }, { status: 404 });
        }

        // Hash the new password and save it
        const passwordHash = await bcrypt.hash(newPassword, 10);
        admin.passwordHash = passwordHash;
        await admin.save();

        // Expire the reset token cookie
        cookieStore.set("password_reset_auth", "", { maxAge: 0, path: "/api/admin/settings/reset-password" });

        return NextResponse.json({ success: true, message: "Password updated successfully" });

    } catch (error: any) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: error.message || "Failed to reset password" }, { status: 500 });
    }
}
