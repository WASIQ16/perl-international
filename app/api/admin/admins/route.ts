import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

async function isAuthenticated() {
    const session = (await cookies()).get("admin_session");
    return session && session.value === "authenticated";
}

async function isSuperAdmin() {
    const role = (await cookies()).get("admin_role");
    return role && role.value === "superadmin";
}

// GET: List all admins (any authenticated admin can view)
export async function GET() {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const admins = await Admin.find({}).select("-password -resetOtp -otpExpiry");
        return NextResponse.json(admins);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Create a new admin (Super Admin only)
export async function POST(req: Request) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!(await isSuperAdmin())) {
            return NextResponse.json({ error: "Only Super Admins can create new admins" }, { status: 403 });
        }

        const { username, email, password, role } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 });
        }

        await dbConnect();

        const existing = await Admin.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return NextResponse.json({ error: "Username or email already exists" }, { status: 409 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            role: role || "admin",
        });

        return NextResponse.json({
            _id: newAdmin._id,
            username: newAdmin.username,
            email: newAdmin.email,
            role: newAdmin.role,
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove an admin (Super Admin only, cannot delete another Super Admin)
export async function DELETE(req: Request) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!(await isSuperAdmin())) {
            return NextResponse.json({ error: "Only Super Admins can remove admins" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Admin ID required" }, { status: 400 });
        }

        await dbConnect();

        const adminToDelete = await Admin.findById(id);
        if (!adminToDelete) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        if (adminToDelete.role === "superadmin") {
            return NextResponse.json({ error: "Cannot delete a Super Admin" }, { status: 403 });
        }

        await Admin.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Admin deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

