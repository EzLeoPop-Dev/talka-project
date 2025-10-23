import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    for (const event of body.events) {
      if (event.type === "message") {
        const userMessage = event.message.text;
        const userId = event.source.userId;

        console.log("ข้อความจาก LINE:", userMessage);

        // ส่งตอบกลับ
        await fetch("https://api.line.me/v2/bot/message/reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            replyToken: event.replyToken,
            messages: [{ type: "text", text: "คุณพิมพ์ว่า: " + userMessage }],
          }),
        });
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 200 }
    );
  }
}

// ถ้ามี request method อื่นที่ไม่ใช่ POST
export async function GET(req) {
  return NextResponse.json(
    { message: "Method GET Not Allowed" },
    { status: 405 }
  );
}
