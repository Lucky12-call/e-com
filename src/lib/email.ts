import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "orders@silkandgrace.com";
const STORE_NAME = "Silk & Grace";

export async function sendOrderConfirmation(to: string, order: {
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  shippingAddress: string;
}) {
  const itemsList = order.items
    .map((i) => `• ${i.name} x${i.quantity} — ₹${i.price.toLocaleString("en-IN")}`)
    .join("\n");

  try {
    await resend.emails.send({
      from: `${STORE_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Order Confirmed — ${order.orderNumber}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #92400e; font-size: 28px; margin: 0;">${STORE_NAME}</h1>
            <p style="color: #737373; margin-top: 5px;">Thank you for your order!</p>
          </div>
          <div style="background: #fffbeb; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #92400e; font-size: 18px; margin: 0 0 16px;">Order #${order.orderNumber}</h2>
            <pre style="font-family: sans-serif; font-size: 14px; color: #374151; white-space: pre-wrap;">${itemsList}</pre>
            <hr style="border: none; border-top: 1px solid #fcd34d; margin: 16px 0;" />
            <p style="font-size: 18px; font-weight: bold; color: #92400e; margin: 0;">
              Total: ₹${order.total.toLocaleString("en-IN")}
            </p>
          </div>
          <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px;">Shipping to:</p>
            <p style="font-size: 14px; color: #374151; margin: 0;">${order.shippingAddress}</p>
          </div>
          <p style="text-align: center; font-size: 13px; color: #9ca3af;">
            If you have questions, reply to this email or contact us at support@silkandgrace.com
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export async function sendOrderStatusUpdate(to: string, data: {
  orderNumber: string;
  status: string;
  trackingUrl?: string;
}) {
  const statusMessages: Record<string, string> = {
    processing: "Your order is being processed and will be shipped soon.",
    shipped: "Your order has been shipped! Track your package below.",
    delivered: "Your order has been delivered. We hope you love your saree!",
    cancelled: "Your order has been cancelled. Refund will be processed within 5-7 business days.",
  };

  try {
    await resend.emails.send({
      from: `${STORE_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Order ${data.status.charAt(0).toUpperCase() + data.status.slice(1)} — ${data.orderNumber}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #92400e; text-align: center; font-size: 28px;">${STORE_NAME}</h1>
          <div style="background: #fffbeb; border-radius: 16px; padding: 24px; margin: 24px 0; text-align: center;">
            <h2 style="color: #374151; margin: 0 0 8px;">Order ${data.status.toUpperCase()}</h2>
            <p style="color: #6b7280; margin: 0;">${statusMessages[data.status] || "Your order status has been updated."}</p>
            ${data.trackingUrl ? `<a href="${data.trackingUrl}" style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #92400e; color: white; text-decoration: none; border-radius: 8px;">Track Order</a>` : ""}
          </div>
          <p style="text-align: center; font-size: 13px; color: #9ca3af;">Order Number: ${data.orderNumber}</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: `${STORE_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Welcome to ${STORE_NAME}! 🎉`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center;">
          <h1 style="color: #92400e; font-size: 28px;">${STORE_NAME}</h1>
          <p style="font-size: 20px; color: #374151; margin: 24px 0 8px;">Welcome, ${name}!</p>
          <p style="color: #6b7280; line-height: 1.6;">
            Thank you for joining ${STORE_NAME}. Explore our exquisite collection of handcrafted Indian sarees.
          </p>
          <p style="margin: 24px 0;">
            Use code <strong style="color: #92400e; font-size: 18px;">WELCOME10</strong> for 10% off your first order!
          </p>
          <a href="${process.env.NEXTAUTH_URL || "https://silkandgrace.com"}"
             style="display: inline-block; padding: 12px 32px; background: #92400e; color: white; text-decoration: none; border-radius: 999px; font-size: 14px;">
            Start Shopping
          </a>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Welcome email error:", error);
    return { success: false, error };
  }
}
