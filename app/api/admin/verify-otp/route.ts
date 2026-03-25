import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { usernameOrEmail, otp, newPassword } = await req.json();

        if (!usernameOrEmail || !otp || !newPassword) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        // 1. Find Admin
        const admin = await Admin.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });

        if (!admin) {
            return NextResponse.json({ error: "Invalid OTP or User" }, { status: 400 });
        }

        // 2. Verify OTP Exists
        if (!admin.resetOtp || !admin.otpExpiry) {
            return NextResponse.json({ error: "No reset request found" }, { status: 400 });
        }

        // 3. Verify OTP Matches
        if (admin.resetOtp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        // 4. Verify OTP is not expired
        if (new Date() > new Date(admin.otpExpiry)) {
            return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        // 5. Update Password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        
        // 6. Clear OTP fields
        admin.resetOtp = undefined;
        admin.otpExpiry = undefined;
        
        await admin.save();

        return NextResponse.json({ success: true, message: "Password updated successfully." });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
