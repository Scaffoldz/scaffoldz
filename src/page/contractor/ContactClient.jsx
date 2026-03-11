import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function ContactClient() {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");
    const userId = localStorage.getItem("userId");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (loading) setLoading(true);
                const data = await api.messages.getByProject(id, "management_contractor");
                setMessages(data.messages || []);
            } catch (err) {
                console.error("Failed to load messages:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => { scrollToBottom(); }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const text = input;
        setInput("");
        try {
            const data = await api.messages.send({ projectId: id, message: text, channel: "management_contractor" });
            setMessages(prev => [...prev, data.messageData]);
        } catch (err) {
            alert("Failed to send message: " + err.message);
        }
    };

    return (
        <div className="h-[calc(100vh-14rem)] flex flex-col space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-primary">Message Center</h1>
                <p className="text-gray-500 mt-1">Direct communication with project management and clients.</p>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-0">
                {/* Chat Header */}
                <div className="p-4 bg-primary flex justify-between items-center text-white flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">M</div>
                        <div>
                            <p className="font-bold leading-tight">Project Management Team</p>
                            <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">● Online</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50/50">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading conversations...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <span className="text-4xl opacity-20">💬</span>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No messages yet</p>
                            <p className="text-gray-400 text-[10px] max-w-[200px]">Send a message to start a discussion about this project.</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((m) => {
                                const isMe = String(m.sender_id) === String(userId);
                                return (
                                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[70%]`}>
                                            <div className={`p-4 rounded-2xl shadow-sm text-sm ${isMe
                                                ? "bg-primary text-white rounded-tr-none"
                                                : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                                }`}>
                                                {m.message}
                                            </div>
                                            <p className={`text-[10px] mt-1 font-bold uppercase ${isMe ? "text-right text-gray-400" : "text-left text-gray-500"}`}>
                                                {m.sender_name || m.sender_role} • {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 flex gap-3 flex-shrink-0">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    />
                    <button onClick={handleSend}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 shadow-md transition-all active:scale-95">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContactClient;
