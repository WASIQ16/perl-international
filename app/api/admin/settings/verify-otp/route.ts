import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req: Request) {
    try {
        const { otp } = await req.json();

        if (!otp || otp.length !== 6) {
            return NextResponse.json({ error: "Invalid OTP format" }, { status: 400 });
        }

        await dbConnect();
        const username = process.env.ADMIN_USERNAME;

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return NextResponse.json({ error: "Admin account not found" }, { status: 404 });
        }

        // Check if OTP matches and hasn't expired
        if (admin.resetOtp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        if (!admin.resetOtpExpiry || new Date() > admin.resetOtpExpiry) {
            return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        // OTP is valid. Clear the OTP fields.
        admin.resetOtp = undefined;
        admin.resetOtpExpiry = undefined;
        await admin.save();

        // Issue a secure resetting cookie valid for 15 minutes
        (await cookies()).set("password_reset_auth", "authorized", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60, // 15 mins
            path: "/api/admin/settings/reset-password",
        });

        return NextResponse.json({ success: true, message: "OTP verified" });

    } catch (error: any) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: error.message || "Failed to verify OTP" }, { status: 500 });
    }
}
