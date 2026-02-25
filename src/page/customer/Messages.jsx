function Messages() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">Messages</h1>
                <p className="text-gray-500 mt-1">Communicate with contractors and management.</p>
            </div>

            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-6xl opacity-20">💬</span>
                <h3 className="text-xl font-bold text-gray-700">No Messages Yet</h3>
                <p className="text-gray-500 max-w-md">
                    Once you start a project, you'll be able to communicate with the management team and contractors directly from here.
                </p>
                <div className="w-full max-w-lg h-64 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 mt-6 p-8">
                    <p className="font-bold text-xs uppercase tracking-widest opacity-50">Conversation History</p>
                    <p className="text-[10px] mt-2 italic">Waiting for project initiation...</p>
                </div>
            </div>
        </div>
    );
}

export default Messages;
