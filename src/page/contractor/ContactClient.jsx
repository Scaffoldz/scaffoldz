import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ContactClient() {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                // In Phase 4, we'll fetch real messages for this project/id
                // For now, removing demo chat as requested.
                setMessages([]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [id]);

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
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading conversations...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <span className="text-4xl opacity-20">💬</span>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active conversations found</p>
                            <p className="text-gray-400 text-[10px] max-w-[200px]">Send a message to management to start a discussion about this project.</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
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
                        ))
                    )}
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
