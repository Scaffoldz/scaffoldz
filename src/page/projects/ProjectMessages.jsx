import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const CHANNELS = {
    customer_management: { label: "Client ↔ Management", icon: "🏢", description: "Messages between the customer and management team." },
    management_contractor: { label: "Management ↔ Contractor", icon: "🏗️", description: "Messages between management and the assigned contractor." },
};

function ProjectMessages() {
    const { id } = useParams();
    const userRole = localStorage.getItem("userRole") || "customer";
    const userId = localStorage.getItem("userId");

    // Management can switch channels; others are locked to their channel
    const defaultChannel = userRole === "contractor" ? "management_contractor" : "customer_management";
    const [activeChannel, setActiveChannel] = useState(defaultChannel);

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        let active = true;
        const fetchMessages = async () => {
            try {
                if (loading) setLoading(true);
                const data = await api.messages.getByProject(id, activeChannel);
                if (active) {
                    setMessages(data.messages || []);
                }
            } catch (err) {
                console.error("Failed to load messages:", err);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => { active = false; clearInterval(interval); };
    }, [id, activeChannel]);

    useEffect(() => { scrollToBottom(); }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const text = input;
        setInput("");
        try {
            const data = await api.messages.send({
                projectId: id,
                message: text,
                channel: activeChannel,
            });
            setMessages(prev => [...prev, data.messageData]);
        } catch (err) {
            alert("Failed to send message: " + err.message);
        }
    };

    const channelInfo = CHANNELS[activeChannel];

    return (
        <div className="space-y-4 animate-fade-in p-8 h-[calc(100vh-50px)] flex flex-col">
            <div className="border-b border-gray-200 pb-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-primary">Project Communications</h1>
                <p className="text-gray-500 mt-1">{channelInfo.description}</p>
            </div>

            {/* Channel Tabs — only visible to management */}
            {userRole === "management" && (
                <div className="flex gap-2 flex-shrink-0">
                    {Object.entries(CHANNELS).map(([key, ch]) => (
                        <button
                            key={key}
                            onClick={() => { setActiveChannel(key); setLoading(true); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${activeChannel === key
                                    ? "bg-primary text-white border-primary shadow-md"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-primary/40"
                                }`}
                        >
                            <span>{ch.icon}</span> {ch.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col overflow-hidden shadow-sm min-h-0">
                {/* Chat Header */}
                <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                            {channelInfo.icon}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">{channelInfo.label}</p>
                            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">● Active Channel</p>
                        </div>
                    </div>
                </div>

                {/* Message Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <span className="text-5xl opacity-20">{channelInfo.icon}</span>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No messages in this channel yet</p>
                            <p className="text-gray-400 text-[10px] max-w-[220px]">Send the first message to start communicating on the <strong>{channelInfo.label}</strong> channel.</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((m) => {
                                const isMe = String(m.sender_id) === String(userId);
                                return (
                                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                        <div className="max-w-md">
                                            <div className={`p-4 rounded-2xl shadow-sm text-sm ${isMe
                                                    ? "bg-primary text-white rounded-tr-none"
                                                    : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
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

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
                    <div className="flex gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSend()}
                            placeholder={`Message ${activeChannel === "customer_management" ? "management team" : "contractor"}...`}
                            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                        />
                        <button onClick={handleSend}
                            className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95">
                            Send
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-2 font-medium italic">All communications are logged for project compliance.</p>
                </div>
            </div>
        </div>
    );
}

export default ProjectMessages;
