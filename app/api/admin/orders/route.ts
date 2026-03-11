import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

// GET: Fetch all orders
export async function GET() {
    try {
        await dbConnect();
        const orders = await Order.find({}).sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Update order status
export async function PUT(req: Request) {
    try {
        await dbConnect();
        const { id, status } = await req.json();
        
        if (!id || !status) {
            return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
