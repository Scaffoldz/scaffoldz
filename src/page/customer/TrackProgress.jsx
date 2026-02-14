function TrackProgress() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">Track Progress</h1>
                <p className="text-gray-500 mt-1">Real-time updates on your construction milestones.</p>
            </div>

            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-6xl opacity-20">📉</span>
                <h3 className="text-xl font-bold text-gray-700">Progress Tracker Placeholder</h3>
                <p className="text-gray-500 max-w-md">
                    Visual timeline and gantt charts showing the current status of your projects.
                </p>
                <div className="w-full max-w-2xl h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 mt-6">
                    Gantt Chart / Timeline Visualization
                </div>
            </div>
        </div>
    );
}

export default TrackProgress;
