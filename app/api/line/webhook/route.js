// app/api/webhook/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

// Verify LINE signature
function verifySignature(body, signature) {
  const hash = crypto
    .createHmac("SHA256", CHANNEL_SECRET)
    .update(body)
    .digest("base64");
  return hash === signature;
}

// Send reply message to LINE
async function replyMessage(replyToken, messages) {
  const response = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("LINE API Error:", error);
    throw new Error("Failed to send reply");
  }

  return response.json();
}

// Handle incoming messages
function handleMessage(event) {
  const { type, text } = event.message;

  if (type === "text") {
    // Echo the message back
    return {
      type: "text",
      text: `You said: ${text}`,
    };
  }

  // Handle other message types
  return {
    type: "text",
    text: "I received your message!",
  };
}

// POST handler for webhook
export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-line-signature");

    // Verify signature
    if (!verifySignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(body);
    const events = data.events;

    // Process each event
    for (const event of events) {
      if (event.type === "message") {
        const replyMessage = handleMessage(event);
        await replyMessage(event.replyToken, [replyMessage]);
      }
      // Handle other event types (follow, unfollow, etc.)
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET handler for webhook verification
export async function GET() {
  return NextResponse.json({ message: "LINE Webhook is running" });
}
