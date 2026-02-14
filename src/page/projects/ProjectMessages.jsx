import { useState } from "react";

function ProjectMessages() {
    const [messages, setMessages] = useState([
        { id: 1, sender: "Management", text: "Rahul, we've updated the foundation schedule. Please check the timeline.", time: "10:30 AM", type: "received" },
        { id: 2, sender: "Me", text: "Got it. Will the cement delivery still arrive by 4 PM?", time: "10:45 AM", type: "sent" },
        { id: 3, sender: "Management", text: "Yes, the vendor confirmed the slot.", time: "10:52 AM", type: "received" },
        { id: 4, sender: "Management", text: "Also, please upload the site clearance photos.", time: "11:05 AM", type: "received" },
    ]);

    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage = {
            id: Date.now(),
            sender: "Me",
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "sent",
        };
        setMessages([...messages, newMessage]);
        setInput("");
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
                    <div className="text-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full border border-gray-100">Today</span>
                    </div>

                    {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md ${m.type === 'sent' ? 'order-1' : 'order-2'}`}>
                                <div className={`p-4 rounded-2xl shadow-sm text-sm ${m.type === 'sent' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {m.text}
                                </div>
                                <p className={`text-[10px] mt-1 font-medium ${m.type === 'sent' ? 'text-right text-gray-400' : 'text-left text-gray-500'}`}>
                                    {m.sender} • {m.time}
                                </p>
                            </div>
                        </div>
                    ))}
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
