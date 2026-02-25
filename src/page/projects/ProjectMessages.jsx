import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function ProjectMessages() {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [input, setInput] = useState("");
    const userRole = localStorage.getItem("userRole") || "customer";
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (loading) setLoading(true);
                const data = await api.messages.getByProject(id);
                setMessages(data.messages || []);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        // Poll every 5 seconds for basic "real-time" experience
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const messageText = input;
        setInput(""); // Clear immediately for UX

        try {
            const data = await api.messages.send({
                project_id: id,
                text: messageText,
                sender_role: userRole
            });
            setMessages([...messages, data.message]);
        } catch (err) {
            alert("Failed to send message: " + err.message);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in p-8 h-[calc(100vh-200px)] flex flex-col">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">Project Communications</h1>
                <p className="text-gray-500 mt-1">Direct channel between Client and Management team.</p>
            </div>

            <div className="flex-1 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col overflow-hidden shadow-sm">
                {/* Chat Header */}
                <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">M</div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">Project Management Team</p>
                            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">● Online</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">📞</button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">📎</button>
                    </div>
                </div>

                {/* Message Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <span className="text-4xl opacity-20">💬</span>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No project messages found</p>
                            <p className="text-gray-400 text-[10px] max-w-[200px]">Start a conversation with the management team about this project.</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full border border-gray-100">Today</span>
                            </div>
                            {messages.map((m) => {
                                const isMe = m.sender_role === userRole;
                                return (
                                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-md ${isMe ? 'order-1' : 'order-2'}`}>
                                            <div className={`p-4 rounded-2xl shadow-sm text-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                                }`}>
                                                {m.text}
                                            </div>
                                            <p className={`text-[10px] mt-1 font-bold uppercase ${isMe ? 'text-right text-gray-400' : 'text-left text-gray-500'}`}>
                                                {m.sender_role} • {new Date(m.created_at || m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Chat Input */}
                <div className="p-6 bg-white border-t border-gray-100">
                    <div className="flex gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message here..."
                            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95"
                        >
                            Send
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-3 font-medium italic">
                        All communications are logged for project compliance.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProjectMessages;
