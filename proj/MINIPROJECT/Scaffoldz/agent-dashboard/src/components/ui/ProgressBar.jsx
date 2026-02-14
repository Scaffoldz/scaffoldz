export default function ProgressBar({ progress }) {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
