import { GripVertical } from 'lucide-react';

export default function KanbanCard({ task, provided }) {
    const priorityColors = {
        high: 'border-l-red-500 bg-red-50',
        medium: 'border-l-yellow-500 bg-yellow-50',
        low: 'border-l-blue-500 bg-blue-50',
    };

    return (
        <div
            ref={provided?.innerRef}
            {...provided?.draggableProps}
            {...provided?.dragHandleProps}
            className={`bg-white p-4 rounded-lg shadow-soft border-l-4 ${priorityColors[task.priority]} mb-3 hover:shadow-soft-md transition-shadow cursor-move`}
        >
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm flex-1">{task.title}</h4>
                <GripVertical size={16} className="text-gray-400 flex-shrink-0" />
            </div>

            <p className="text-xs text-gray-600 mb-3">{task.description}</p>

            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                        {task.assignee.charAt(0)}
                    </div>
                    <span className="text-gray-600">{task.assignee}</span>
                </div>
                <span className="text-gray-500">{task.dueDate}</span>
            </div>
        </div>
    );
}
