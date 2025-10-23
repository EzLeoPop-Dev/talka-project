import { useState } from "react"

export default function ChatInput({ onSend }) {
    const [text, setText] = useState("")

    const handleSend = () => {
        if (!text.trim()) return
        onSend(text)
        setText("")
    }

    return (
        <div className="flex gap-2 mt-2">
            <input
                className="flex-1 border rounded-lg p-2"
                placeholder="พิมพ์ข้อความ..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
                className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
                onClick={handleSend}
            >
                ส่ง
            </button>
        </div>
    )
}
