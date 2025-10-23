"use client"
import { useState } from "react"
import ChatBox from "@/app/components/ChatBox.jsx"
import ChatInput from "@/app/components/ChatInput.jsx"

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { from: "bot", text: "ยินดีต้อนรับสู่ OneChat LINE Demo!" },
    ])

    const handleSend = (text) => {
        setMessages([...messages, { from: "user", text }])
        // Auto-reply (Frontend only)
        setTimeout(() => {
            setMessages((prev) => [...prev, { from: "bot", text: "คุณพิมพ์ว่า: " + text }])
        }, 500)
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4 text-center">💬 OneChat Demo</h1>
            <ChatBox messages={messages} />
            <ChatInput onSend={handleSend} />
        </div>
    )
}
