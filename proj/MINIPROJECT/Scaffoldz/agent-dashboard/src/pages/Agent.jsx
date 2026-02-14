import { Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import ChatMessage from '../components/ui/ChatMessage';
import { chatMessages as initialMessages, suggestedPrompts } from '../data/dummyData';

export default function Agent() {
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: inputValue,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputValue('');

        // Simulate agent response
        setTimeout(() => {
            const agentResponse = {
                id: messages.length + 2,
                sender: 'agent',
                text: "I'm processing your request. This is a demo response showing how the chat interface works!",
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, agentResponse]);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handlePromptClick = (prompt) => {
        setInputValue(prompt);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agent</h1>
                <p className="text-gray-600">Your intelligent personal assistant for project management.</p>
            </div>

            {/* Chat container */}
            <div className="flex-1 bg-white rounded-2xl shadow-soft border border-gray-200 flex flex-col overflow-hidden">
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {messages.map(message => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                </div>

                {/* Suggested prompts */}
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-gray-500" />
                        <span className="text-xs text-gray-500 font-medium">Suggested Prompts</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggestedPrompts.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handlePromptClick(prompt)}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input area */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-end gap-3">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask your agent anything..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                            rows="1"
                        />
                        <button
                            onClick={handleSend}
                            className="btn-primary px-4 py-3 flex items-center justify-center"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
