import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({ status: "success", message: "MongoDB connected successfully!" });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
