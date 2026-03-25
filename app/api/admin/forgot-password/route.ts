import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
    try {
        const { usernameOrEmail } = await req.json();

        if (!usernameOrEmail) {
            return NextResponse.json({ error: "Username or email required" }, { status: 400 });
        }

        await dbConnect();

        // Find admin by username or email
        const admin = await Admin.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });

        if (!admin) {
            // Return success even if not found to prevent user enumeration
            return NextResponse.json({ success: true, message: "If the account exists, an OTP was sent." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP and set expiry (15 minutes from now)
        admin.resetOtp = otp;
        admin.otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
        await admin.save();

        // Send Email
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #242553; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-style: italic;">Admin Portal</h1>
                </div>
                <div style="padding: 30px; background-color: #f8fafc;">
                    <h2 style="color: #242553; margin-top: 0;">Password Reset Request</h2>
                    <p style="color: #64748b; font-size: 16px; line-height: 1.5;">You recently requested to reset the password for your admin account. Please use the following One-Time Password (OTP) to proceed.</p>
                    <div style="background-color: white; border: 2px dashed #2587a7; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: 900; color: #2587a7; letter-spacing: 5px;">${otp}</span>
                    </div>
                    <p style="color: #64748b; font-size: 14px;">This code will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
                </div>
            </div>
        `;

        await sendEmail({
            to: admin.email,
            subject: "Admin Password Reset OTP",
            html,
        });

        return NextResponse.json({ success: true, message: "If the account exists, an OTP was sent." });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
