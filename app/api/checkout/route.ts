import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { fullName, email, address, city, cartItems, totalPrice } = await req.json();

        if (!fullName || !email || !address || !cartItems) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

        // 1. Send email to Admin (Notification)
        await resend.emails.send({
            from: "Order Alert <onboarding@resend.dev>",
            to: "wasiqeuroshub@gmail.com", // Assuming this is your admin email
            subject: `New Order from ${fullName}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
          <h1 style="color: #2563eb; margin-top: 0;">New Order Received!</h1>
          <p>You have a new order from <strong>${fullName}</strong> (${email}).</p>
          
          <h2 style="border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Shipping Details</h2>
          <p><strong>Address:</strong> ${address}, ${city}</p>
          
          <h2 style="border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Order Summary</h2>
          ${itemsHtml}
          
          <div style="margin-top: 20px; font-size: 1.25rem; font-weight: bold;">
            Total Amount: <span style="color: #2563eb;">$${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      `,
        });

        // 2. Send confirmation email to Customer
        await resend.emails.send({
            from: "Pearl International <onboarding@resend.dev>",
            to: email,
            subject: "Order Confirmation - Pearl International",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
          <h1 style="color: #2563eb; margin-top: 0;">Order Confirmed!</h1>
          <p>Hi <strong>${fullName}</strong>, thank you for shopping with Pearl International. Your order has been placed successfully.</p>
          
          <h2 style="border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Your Order</h2>
          ${itemsHtml}
          
          <div style="margin-top: 20px; font-size: 1.25rem; font-weight: bold;">
            Total Price: <span style="color: #2563eb;">$${totalPrice.toFixed(2)}</span>
          </div>
          
          <p style="margin-top: 30px; font-size: 0.8rem; color: #666;">
            We will contact you soon with tracking details.
          </p>
        </div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Order processing error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
