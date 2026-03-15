import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req: Request) {
    try {
        await dbConnect();

        const username = process.env.ADMIN_USERNAME;
        if (!username) {
            return NextResponse.json({ error: "Admin username not configured in environment" }, { status: 500 });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Expires in 15 minutes
        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        const admin = await Admin.findOneAndUpdate(
            { username },
            { resetOtp: otp, resetOtpExpiry: expiry },
            { new: true }
        );

        if (!admin) {
            return NextResponse.json({ error: "Admin account not found in database. Please login once to initialize." }, { status: 404 });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "465"),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const targetEmail = "wasiq161102@gmail.com";

        await transporter.sendMail({
            from: `"Pearl International Security" <${process.env.SMTP_USER}>`,
            to: targetEmail,
            subject: "Admin Password Reset code - Pearl International",
            html: `
                <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; text-align: center;">
                    <h2 style="color: #1e293b;">Password Reset Request</h2>
                    <p style="color: #475569; font-size: 16px; margin-bottom: 30px;">You are receiving this email because a password reset was requested for the admin panel.</p>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; margin-bottom: 30px;">
                        ${otp}
                    </div>
                    <p style="color: #64748b; font-size: 14px;">This code will expire in 15 minutes.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                    <p style="color: #94a3b8; font-size: 12px;">If you did not request this, please ignore this email.</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true, message: "OTP sent successfully" });

    } catch (error: any) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ error: error.message || "Failed to send OTP" }, { status: 500 });
    }
}
