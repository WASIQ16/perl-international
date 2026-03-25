import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Setting from "@/models/Setting";
import { cookies } from "next/headers";

// Authentication Helper
async function isAuthenticated() {
    const session = (await cookies()).get("admin_session");
    return session && session.value === "authenticated";
}

// Ensure at least one setting document exists
async function getSettingsDoc() {
    let settings = await Setting.findOne();
    if (!settings) {
        settings = await Setting.create({ showPrices: true });
    }
    return settings;
}

export async function GET() {
    try {
        await dbConnect();
        const settings = await getSettingsDoc();
        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        await dbConnect();
        
        const settings = await getSettingsDoc();
        settings.showPrices = body.showPrices !== undefined ? body.showPrices : settings.showPrices;
        await settings.save();

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
