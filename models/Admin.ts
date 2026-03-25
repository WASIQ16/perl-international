import mongoose, { Schema, model, models } from "mongoose";

export interface IAdmin {
    _id: string;
    username: string;
    email: string;
    role: "superadmin" | "admin";
    password?: string;
    resetOtp?: string;
    otpExpiry?: Date;
}

const AdminSchema = new Schema<IAdmin>(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, enum: ["superadmin", "admin"], default: "admin" },
        password: { type: String, required: true },
        resetOtp: { type: String },
        otpExpiry: { type: Date },
    },
    { timestamps: true }
);

const Admin = models.Admin || model<IAdmin>("Admin", AdminSchema);

export default Admin;
