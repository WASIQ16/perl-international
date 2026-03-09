import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
    try {
        const result = await cloudinary.api.ping();
        return NextResponse.json({ status: "success", message: "Cloudinary connected successfully!", result });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
