import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';
import { tasks as initialTasks } from '../data/dummyData';
import KanbanCard from '../components/ui/KanbanCard';

export default function Tasks() {
    const [tasks, setTasks] = useState(initialTasks);

    const columns = {
        todo: { id: 'todo', title: 'To Do', color: 'border-gray-300 bg-gray-50' },
        'in-progress': { id: 'in-progress', title: 'In Progress', color: 'border-blue-300 bg-blue-50' },
        done: { id: 'done', title: 'Done', color: 'border-green-300 bg-green-50' },
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) return;

        setTasks(tasks.map(task =>
            task.id === parseInt(draggableId)
                ? { ...task, status: destination.droppableId }
                : task
        ));
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
                <p className="text-gray-600">Organize and track your tasks across different stages.</p>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.values(columns).map(column => (
                        <div key={column.id} className="flex flex-col">
                            <div className={`mb-4 p-4 rounded-lg border-2 ${column.color}`}>
                                <h2 className="font-semibold text-gray-900 flex items-center justify-between">
                                    <span>{column.title}</span>
                                    <span className="text-sm bg-white px-2 py-1 rounded-full">
                                        {getTasksByStatus(column.id).length}
                                    </span>
                                </h2>
                            </div>

                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 p-4 rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-primary-50 border-2 border-primary-300 border-dashed' : 'bg-gray-50 border-2 border-transparent'
                                            }`}
                                    >
                                        {getTasksByStatus(column.id).map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            opacity: snapshot.isDragging ? 0.8 : 1,
                                                        }}
                                                    >
                                                        <KanbanCard task={task} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
