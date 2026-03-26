import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

// Normalize: ensure images array exists
function normalizeImages(data: any) {
    if (data.images && data.images.length > 0) {
        // Set legacy image field to first image for backward compat
        data.image = data.images[0];
    } else if (data.image) {
        data.images = [data.image];
    }
    return data;
}

// POST: Add a new product
export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = normalizeImages(await req.json());
        
        const product = await Product.create(data);
        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Update an existing product
export async function PUT(req: Request) {
    try {
        await dbConnect();
        const { id, ...rawData } = await req.json();
        const updateData = normalizeImages(rawData);
        
        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove a product
export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

