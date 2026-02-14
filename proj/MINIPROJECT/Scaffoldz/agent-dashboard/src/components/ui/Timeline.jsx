export default function Timeline({ events }) {
    return (
        <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
                {events.map((event, index) => (
                    <div key={event.id} className="relative pl-10">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1">
                            <div className="w-6 h-6 rounded-full bg-primary-100 border-4 border-white shadow-sm flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-white p-4 rounded-lg shadow-soft border border-gray-100 hover:shadow-soft-md transition-shadow">
                            <div className="text-xs text-gray-500 mb-1">{event.date}</div>
                            <div className="font-semibold text-gray-900 mb-1">{event.title}</div>
                            <div className="text-sm text-gray-600">{event.description}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
