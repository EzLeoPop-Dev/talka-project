export default function ChatBox({ messages }) {
    return (
        <div className="p-4 bg-gray-100 rounded-lg h-[400px] overflow-y-auto">
            {messages.map((msg, i) => (
                <div
                    key={i}
                    className={`my-2 p-2 rounded ${msg.from === "user" ? "bg-green-200 text-right" : "bg-gray-200"
                        }`}
                >
                    {msg.text}
                </div>
            ))}
        </div>
    )
}
