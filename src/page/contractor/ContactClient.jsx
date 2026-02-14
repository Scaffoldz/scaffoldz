import { useState } from "react";

function ContactClient() {
    const [messages] = useState([
        { id: 1, sender: "You", text: "The foundation piling for Sector 4 is complete. Requesting your presence for inspection tomorrow.", time: "10:30 AM", status: "Read" },
        { id: 2, sender: "Management", text: "Inspection scheduled for 2 PM tomorrow. Our structural engineer will be there.", time: "11:15 AM", status: "Received" },
        { id: 3, sender: "You", text: "Great. I'll have the site records ready.", time: "11:20 AM", status: "Sent" },
    ]);

    return (
        <div className="h-[calc(100vh-14rem)] flex flex-col space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-primary">Message Center</h1>
                <p className="text-gray-500 mt-1">Direct communication with project management and clients.</p>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                {/* Chat Header */}
                <div className="p-4 bg-primary flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center font-bold">M</div>
                        <div>
                            <p className="font-bold leading-tight">Project Management Team</p>
                            <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Online</p>
                        </div>
                    </div>
                    <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md font-bold transition-all">
                        View Details
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                            <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm ${msg.sender === "You"
                                    ? "bg-primary text-white rounded-tr-none"
                                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                }`}>
                                {msg.text}
                            </div>
                            <div className={`mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${msg.sender === "You" ? "text-primary" : "text-gray-400"
                                }`}>
                                {msg.sender} • {msg.time} {msg.sender === "You" && `• ${msg.status}`}
                            </div>
                        </div>
                    ))}
                    <div className="text-center py-4">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-3 py-1 bg-white border border-gray-200 rounded-full">
                            Today
                        </span>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 flex gap-4">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors text-xl">
                        +
                    </button>
                    <input
                        type="text"
                        placeholder="Type your message for management..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    />
                    <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 shadow-md transition-all">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContactClient;
