export default function ChatMessage({ message }) {
    const isUser = message.sender === 'user';

    return (
        <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${isUser ? 'bg-primary-600' : 'bg-gradient-to-br from-accent-500 to-accent-600'
                }`}>
                {isUser ? 'U' : 'AI'}
            </div>

            {/* Message bubble */}
            <div className={`max-w-md ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-2.5 rounded-2xl ${isUser
                        ? 'bg-primary-600 text-white rounded-tr-sm'
                        : 'bg-white border border-gray-200 text-gray-900 rounded-tl-sm shadow-soft'
                    }`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1 px-2">{message.timestamp}</span>
            </div>
        </div>
    );
}
