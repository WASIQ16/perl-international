import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { fullName, email, address, city, cartItems, totalPrice } = await req.json();

    if (!fullName || !email || !address || !cartItems) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 0. Save order to Database
    let savedOrder;
    try {
      savedOrder = await Order.create({
        fullName,
        email,
        address,
        city,
        cartItems: cartItems.map((item: any) => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalPrice,
        status: "Pending"
      });
      console.log("Order saved to database:", savedOrder._id);
    } catch (dbError) {
      console.error("Database Order Save Error:", dbError);
      // We continue with email even if DB fails for now, or we could return error
    }

    // Format the order items for the email
    const itemsHtml = cartItems
      .map(
        (item: any) => `
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
          <strong>${item.name}</strong> x ${item.quantity}<br/>
          Price: $${item.price.toFixed(2)} | Subtotal: $${(item.price * item.quantity).toFixed(2)}
        </div>
      `
      )
      .join("");

    const emailContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
          <h1 style="color: #2563eb; margin-top: 0;">Order Details</h1>
          <p><strong>Customer Name:</strong> ${fullName}</p>
          <p><strong>Customer Email:</strong> ${email}</p>
          
          <h2 style="border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Shipping Details</h2>
          <p><strong>Address:</strong> ${address}, ${city}</p>
          
          <h2 style="border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Order Summary</h2>
          ${itemsHtml}
          
          <div style="margin-top: 20px; font-size: 1.25rem; font-weight: bold;">
            Total Amount: <span style="color: #2563eb;">$${totalPrice.toFixed(2)}</span>
          </div>
        </div>
    `;

    // 1. Send email to Admin
    try {
      await transporter.sendMail({
        from: `"Pearl International Orders" <${process.env.SMTP_USER}>`,
        to: "wasiq.euroshub@gmail.com",
        subject: `New Order from ${fullName}`,
        html: emailContent,
      });
      console.log("Admin email sent via Nodemailer");
    } catch (adminError: any) {
      console.error("Nodemailer Admin Error:", adminError);
    }

    // 2. Send confirmation email to Customer
    try {
      await transporter.sendMail({
        from: `"Pearl International" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Order Confirmation - Pearl International",
        html: emailContent,
      });
      console.log("Customer email sent via Nodemailer");
    } catch (customerError: any) {
      console.error("Nodemailer Customer Error:", customerError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Checkout processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
